from rest_framework import serializers
from .models import Stock

class KpiSerializer(serializers.Serializer):
    ticker = serializers.CharField(max_length=10)
    date = serializers.DateField()
    open = serializers.FloatField()
    high = serializers.FloatField()
    low = serializers.FloatField()
    volume = serializers.IntegerField()
    daily_closing_price = serializers.FloatField()
    price_change_24h = serializers.FloatField()
    price_change_7d = serializers.FloatField()
    price_change_30d = serializers.FloatField()

class GainerLoserSerializer(serializers.Serializer):
    ticker = serializers.CharField(max_length=10)
    change_value = serializers.FloatField()
    change_percentage = serializers.FloatField()

