from django.contrib import admin
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from api.views import RegisterView, RouteListCreateView, AIRouteOptimizerView, AIProspectorView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', obtain_auth_token),
    path('api/register/', RegisterView.as_view()),
    path('api/routes/', RouteListCreateView.as_view()),
    path('api/ai/route/', AIRouteOptimizerView.as_view()),
    path('api/ai/prospect/', AIProspectorView.as_view()),
]
