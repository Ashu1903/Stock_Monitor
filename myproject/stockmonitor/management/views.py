from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware.csrf import get_token
from .serializers import RegisterSerializer
from django.views import View
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
# from django.contrib.auth import logout
from django.http import JsonResponse
# CSRF Token View
# class CsrfTokenView(APIView):
#     def get(self, request):
#         csrf_token = get_token(request)
#         return Response({'csrfToken': csrf_token})
class CsrfTokenView(View):
    def get(self, request, *args, **kwargs):
        csrf_token = get_token(request)
        return JsonResponse({'csrfToken': csrf_token})

# Registration View
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class LogoutView(View):
#     def post(self, request, *args, **kwargs):
#         logout(request)
#         return JsonResponse({'message': 'Successfully logged out'})

# Login View
class LoginView(APIView):
    authentication_classes = []  # No authentication
    permission_classes = [AllowAny]  # Allow any user
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
from django.views.decorators.csrf import csrf_exempt

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    # authentication_classes = []  # No authentication
    
    logout(request)
    return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)