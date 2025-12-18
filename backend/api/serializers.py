from django.contrib.auth.models import User
from rest_framework import serializers
from .models import SavedRoute

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # O create_user já criptografa a senha automaticamente
        user = User.objects.create_user(**validated_data)
        return user
    
class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedRoute
        fields = ['id', 'title', 'route_data', 'created_at']
        read_only_fields = ['user'] # O usuário é pego automaticamente do token, não precisa enviar