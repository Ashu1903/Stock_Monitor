import yfinance as yf
from django.core.management.base import BaseCommand
from stockapp.models import Stock
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Fetch and store stock data from Yahoo Finance for multiple stocks'

    def handle(self, *args, **kwargs):
        # List of stock tickers
        tickers = [
            'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA',
            'NFLX', 'BABA', 'JNJ', 'WMT', 'JPM', 'V', 'PG',
            'XOM', 'BAC', 'DIS', 'MA', 'PFE', 'HD', 'NKE'
        ]

        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=1)  

        for ticker in tickers:
            try:
                # Fetch data from Yahoo Finance
                data = yf.download(ticker, start=start_date, end=end_date)

                if data.empty:
                    self.stdout.write(self.style.WARNING(f'No data fetched for {ticker}'))
                    continue

                for date, row in data.iterrows():
                    # Update or create stock data in the database
                    stock, created = Stock.objects.update_or_create(
                        ticker=ticker,
                        date=date.date(),  # Ensure date is in the correct format
                        defaults={
                            'open': row['Open'],
                            'high': row['High'],
                            'low': row['Low'],
                            'close': row['Close'],
                            'volume': row['Volume'],
                        }
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Successfully added data for {ticker} on {date.date()}'))
                    else:
                        self.stdout.write(self.style.SUCCESS(f'Successfully updated data for {ticker} on {date.date()}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error fetching data for {ticker}: {e}'))
