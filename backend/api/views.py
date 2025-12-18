import os
import google.generativeai as genai
from rest_framework.views import APIView
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from .models import SavedRoute
from .serializers import RouteSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Permite que qualquer um (mesmo deslogado) crie conta
    serializer_class = UserSerializer

class RouteListCreateView(generics.ListCreateAPIView):
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated] # Só logado pode usar

    def get_queryset(self):
        # Retorna apenas as rotas do usuário atual
        return SavedRoute.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Salva a rota vinculando ao usuário logado
        serializer.save(user=self.request.user)

class AIRouteOptimizerView(APIView):
    # Se quiser que apenas usuários logados usem, mantenha IsAuthenticated
    # Se quiser testar sem login por enquanto, use AllowAny
    permission_classes = [IsAuthenticated] 

    def post(self, request):
        addresses = request.data.get('addresses', [])
        
        if not addresses or len(addresses) < 2:
            return Response({"error": "Forneça pelo menos 2 endereços."}, status=status.HTTP_400_BAD_REQUEST)

        # Monta o Prompt aqui no Backend (Mais seguro e organizado)
        lista_formatada = "\n".join([f"- {addr}" for addr in addresses])
        prompt = f"""
        Atue como um especialista em Logística e Roteirização.
        Otimize a seguinte lista de endereços para criar a rota mais eficiente logicamente:
        
        {lista_formatada}
        
        Regras Obrigatórias:
        1. Mantenha o primeiro endereço como Ponto de Partida.
        2. Reordene os intermediários para menor distância.
        3. Gere a resposta em formato Markdown limpo.
        4. Inclua links do Google Maps para cada ponto.
        """

        try:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            
            # Retorna o texto gerado para o React
            return Response({"result": response.text})
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AIProspectorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        business_type = request.data.get('businessType')
        location = request.data.get('location')
        count = request.data.get('count', 5)

        prompt = f"""
        Atue como um gerente comercial especialista.
        Gere uma lista de {count} possíveis leads do tipo "{business_type}" na região de "{location}".
        
        Para cada lead inclua:
        - Nome fictício ou real (se souber)
        - Motivo da prospecção
        - Um "gancho" de venda personalizado
        
        Formate em Markdown.
        """

        try:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            return Response({"result": response.text})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)