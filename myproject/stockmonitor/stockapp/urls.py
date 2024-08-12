from django.urls import path
from .views import KpiView, TopMoversView
from . import views

urlpatterns = [
    path('kpi/', KpiView.as_view(), name='kpi'),
    path('top-movers/', TopMoversView.as_view(), name='top_movers'),
    path('stock-price-metrics/', views.stock_price_metrics, name='stock_price_metrics'),
]
