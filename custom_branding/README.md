# CloudGuard Custom Branding Documentation

This directory contains the custom user-facing branding and theme overrides that transform the local DefectDojo Community Edition deployment into **CloudGuard – AI-Powered Cloud Security & Intelligent Remediation Platform**.

## Architectural Principle: Upgrade Safety
- **Zero modification to core Python code, models, serializers, Celery tasks, or database migrations.**
- All branding changes are applied via **Docker Compose volume bind-mounts** (`docker-compose.override.yml`), leaving upstream Git tracking completely clean.
- When DefectDojo is upgraded via git pull or image bumps, CloudGuard branding remains intact and can be reapplied or updated without merge conflicts.

## Customized Files Overview

| Asset / File | Target Container Path | Purpose |
| :--- | :--- | :--- |
| `custom_branding/templates/base.html` | `/app/dojo/templates/base.html` | Browser `<title>`, navigation header, sidebar logo, and footer branding. |
| `custom_branding/templates/dojo/login.html` | `/app/dojo/templates/dojo/login.html` | Cyber-security dark theme login card, badge, and CloudGuard branding. |
| `custom_branding/static/dojo/img/logo.svg` | `/usr/share/nginx/html/static/dojo/img/logo.svg` | Main CloudGuard shield-and-cloud logo. |
| `custom_branding/static/dojo/img/symbol.svg` | `/usr/share/nginx/html/static/dojo/img/symbol.svg` | Shield emblem for navigation and footer. |
| `custom_branding/static/dojo/img/favicon.svg` | `/usr/share/nginx/html/static/dojo/img/favicon.svg` | Browser tab favicon. |
| `custom_branding/static/dojo/css/cloudguard.css` | `/usr/share/nginx/html/static/dojo/css/cloudguard.css` | Dark navy/cyan theme styles, active states, and card styling. |

## Backup Files
- Original templates have been backed up in `dojo/templates/base.html.orig` and `dojo/templates/dojo/login.html.orig`.

## How to Manage
- To restart services with branding:
  ```powershell
  docker compose up -d --no-deps uwsgi nginx
  ```
- To view live logs:
  ```powershell
  docker compose logs -f uwsgi
  ```
