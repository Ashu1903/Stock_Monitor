from django.urls import path
from .views import RegisterView, LoginView, CsrfTokenView, logout_view

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('csrf/', CsrfTokenView.as_view(), name='csrf_token'),
    path('logout/', logout_view, name='logout'),  # Add this line
]
