import pandas as pd
from datetime import timedelta
from django.db.models import Max
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Stock
from .serializers import KpiSerializer, GainerLoserSerializer
from prometheus_client import CollectorRegistry, Gauge, generate_latest
from django.http import HttpResponse
from rest_framework.permissions import AllowAny

class KpiView(APIView):
    
    def get(self, request):
        # Get the latest date available in the database
        latest_date = Stock.objects.aggregate(Max('date'))['date__max']
        if not latest_date:
            return Response({"error": "No stock data available"}, status=status.HTTP_404_NOT_FOUND)

        # Get the latest stock data points
        latest_stock_data = Stock.objects.filter(date=latest_date).values('ticker', 'close', 'open', 'high', 'low', 'volume')
        tickers = latest_stock_data.values_list('ticker', flat=True).distinct()

        kpi_data = []
        for ticker in tickers:
            latest_stock = Stock.objects.filter(ticker=ticker, date=latest_date).first()
            if latest_stock:
                price_change_24h = self.get_price_change(ticker, latest_date - timedelta(days=1), latest_date)
                price_change_7d = self.get_price_change(ticker, latest_date - timedelta(days=7), latest_date)
                price_change_30d = self.get_price_change(ticker, latest_date - timedelta(days=30), latest_date)

                kpi_data.append({
                    'ticker': ticker,
                    'date': latest_stock.date,
                    'open': latest_stock.open,
                    'high': latest_stock.high,
                    'low': latest_stock.low,
                    'volume': latest_stock.volume,
                    'daily_closing_price': latest_stock.close,
                    'price_change_24h': price_change_24h,
                    'price_change_7d': price_change_7d,
                    'price_change_30d': price_change_30d,
                })

        serializer = KpiSerializer(kpi_data, many=True)
        return Response(serializer.data)

    def get_price_change(self, ticker, start_date, end_date):
        # Fetch stock data within the specified date range
        stocks = Stock.objects.filter(ticker=ticker, date__range=[start_date, end_date]).values('date', 'close')
        if not stocks:
            return None

        df = pd.DataFrame(stocks)
        df['date'] = pd.to_datetime(df['date'])
        df.set_index('date', inplace=True)
        df.sort_index(inplace=True)

        if len(df) < 2:
            return None

        start_price = df.iloc[0]['close']
        end_price = df.iloc[-1]['close']

        return ((end_price - start_price) / start_price) * 100

class TopMoversView(APIView):
    
    def get(self, request):
        # Get the latest date available in the database
        latest_date = Stock.objects.aggregate(Max('date'))['date__max']
        if not latest_date:
            return Response({"error": "No stock data available"}, status=status.HTTP_404_NOT_FOUND)

        # Define time period for comparison
        one_day_ago = latest_date - timedelta(days=1)

        # Fetch stock data for today and yesterday
        stock_today = Stock.objects.filter(date=latest_date).values('ticker', 'close')
        stock_yesterday = Stock.objects.filter(date=one_day_ago).values('ticker', 'close')

        df_today = pd.DataFrame(stock_today)
        df_yesterday = pd.DataFrame(stock_yesterday)

        if df_today.empty or df_yesterday.empty:
            return Response({'top_gainers': [], 'top_losers': []})

        df_today.set_index('ticker', inplace=True)
        df_yesterday.set_index('ticker', inplace=True)

        merged_df = df_today.join(df_yesterday, lsuffix='_today', rsuffix='_yesterday')
        merged_df['change_value'] = merged_df['close_today'] - merged_df['close_yesterday']
        merged_df['change_percentage'] = (merged_df['change_value'] / merged_df['close_yesterday']) * 100

        movers = merged_df.reset_index()
        top_gainers = movers.sort_values(by='change_value', ascending=False).head(5)
        top_losers = movers.sort_values(by='change_value').head(5)

        gainers_serializer = GainerLoserSerializer(top_gainers.to_dict(orient='records'), many=True)
        losers_serializer = GainerLoserSerializer(top_losers.to_dict(orient='records'), many=True)

        return Response({
            'top_gainers': gainers_serializer.data,
            'top_losers': losers_serializer.data
        })


def stock_price_metrics(request):
    registry = CollectorRegistry()
    
    # Define your custom metrics
    stock_price_gauge = Gauge('stock_price_change_percentage', 
                              'Percentage change in stock price',
                              ['ticker'],
                              registry=registry)
    
    # Fetch stock data and update metrics
    stock_prices = Stock.objects.all()
    for stock in stock_prices:
        if stock.open != 0:
            price_change_percentage = ((stock.close - stock.open) / stock.open) * 100
        else:
            price_change_percentage = 0
        stock_price_gauge.labels(ticker=stock.ticker).set(price_change_percentage)
    
    # Generate the metrics output
    metrics = generate_latest(registry).decode('utf-8')
    
    return HttpResponse(metrics, content_type='text/plain; version=0.0.4; charset=utf-8')
