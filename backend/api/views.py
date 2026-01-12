import os
import google.generativeai as genai
from rest_framework.views import APIView
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import SavedRoute
from .serializers import UserSerializer, RouteSerializer

# Configuração da API Key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Definindo o modelo disponível conforme seus logs do Render
CURRENT_MODEL = 'gemini-1.5-flash'

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Permite que qualquer um crie conta
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
    permission_classes = [IsAuthenticated] 

    def post(self, request):
        addresses = request.data.get('addresses', [])
        
        if not addresses or len(addresses) < 2:
            return Response({"error": "Forneça pelo menos 2 endereços."}, status=status.HTTP_400_BAD_REQUEST)

        # Monta o Prompt
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

        # --- CORREÇÃO AQUI ---
        # 1. Primeiro criamos o objeto model
        model = genai.GenerativeModel(CURRENT_MODEL)

        # 2. Agora sim podemos imprimir o nome dele para debug
        print("--- DEBUG FINAL ---")
        print(f"O modelo que o Python está usando é: {model.model_name}") 

        try:
            # 3. Chama a API
            response = model.generate_content(prompt)
            
            return Response({"result": response.text})
            
        except Exception as e:
            # Imprime o erro no console do Render para facilitar o debug se falhar
            print(f"Erro Gemini Route: {str(e)}")
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
            # Usando o modelo disponível no seu ambiente
            model = genai.GenerativeModel(CURRENT_MODEL)
            response = model.generate_content(prompt)
            return Response({"result": response.text})
        except Exception as e:
            print(f"Erro Gemini Prospect: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)