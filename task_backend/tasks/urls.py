from django.urls import path
from .views import suggest_tasks, analyze_tasks

urlpatterns = [
    path("suggest-tasks/", suggest_tasks),
    path("analyze-tasks/", analyze_tasks),
]
