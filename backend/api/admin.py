from django.contrib import admin
from .models import Prospect

@admin.register(Prospect)
class ProspectAdmin(admin.ModelAdmin):
    list_display = ('nome_empresa', 'usuario', 'data_criacao')
    search_fields = ('nome_empresa',)