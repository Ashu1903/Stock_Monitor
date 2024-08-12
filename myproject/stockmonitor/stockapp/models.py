from django.db import models

# Create your models here.

class Stock(models.Model):
    ticker = models.CharField(max_length=10)
    date = models.DateField()
    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    volume = models.BigIntegerField()

    class Meta:
        unique_together = ('ticker', 'date')

    def __str__(self):
        return f"{self.ticker} - {self.date}"
