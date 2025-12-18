from django.db import models
from django.contrib.auth.models import User

class Prospect(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nome_empresa = models.CharField(max_length=200)
    resultado_ia = models.TextField(help_text="Resposta gerada pelo Gemini")
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome_empresa} - {self.usuario.username}"
    
class SavedRoute(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) # Liga a rota ao usuário logado
    title = models.CharField(max_length=200, default="Minha Rota")
    route_data = models.TextField() # Aqui vamos salvar o texto/JSON que o Gemini gerou
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.created_at.strftime('%d/%m/%Y')}"