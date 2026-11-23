from django.urls import re_path
from dojo.home import views

urlpatterns = [
    re_path(r"^$", views.home, name="home"),
    re_path(r"^dashboard$", views.dashboard, name="dashboard"),
    re_path(r"^dashboard/$", views.dashboard),
    re_path(r"^dashboard\*\*$", views.dashboard),
    re_path(r"^support$", views.support, name="support"),
    re_path(r"^remediation/audit$", views.remediation_audit, name="remediation_audit"),
    re_path(r"^github/scanner$", views.github_scanner_view, name="github_scanner"),
    re_path(r"^github/webhook$", views.github_webhook_endpoint, name="github_webhook"),
]
