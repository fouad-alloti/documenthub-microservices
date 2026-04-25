# 📄 DocumentHub - Plateforme de Partage Documentaire Microservices

![Python](https://img.shields.io/badge/Python-3.11-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Minikube-green)
![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📌 Description

**DocumentHub** est une plateforme de partage et de gestion de documents techniques inspirée du BIM (Building Information Modeling). Elle repose sur une **architecture microservices** déployée avec **Docker** et **Kubernetes**, permettant le partage de fichiers entre architectes, ingénieurs et chefs de projet.

> Projet réalisé dans le cadre du cours de **Programmation Distribuée** — Master 1 Informatique, Université Paris Cité 2026.

---

## 🏗️ Architecture

```
                        ┌─────────────────────────────┐
                        │     Kubernetes Ingress       │
                        │     (API Gateway nginx)      │
                        └─────────────┬───────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
   │   File Service   │   │ Project Service  │   │  Audit Service   │
   │   (Python:5001)  │   │  (Python:5002)   │   │  (Python:5003)   │
   └────────┬─────────┘   └────────┬─────────┘   └────────┬─────────┘
            │                      │                       │
            └──────────────────────┼───────────────────────┘
                                   │
                         ┌─────────▼──────────┐
                         │    PostgreSQL 15    │
                         │   (Port 5432)       │
                         └────────────────────┘
```

---

## 🚀 Technologies utilisées

| Technologie | Version | Rôle |
|------------|---------|------|
| Python | 3.11 | Langage backend des microservices |
| Flask | 3.0 | Framework web REST API |
| Docker | Latest | Containerisation des services |
| Kubernetes | 1.35 | Orchestration des conteneurs |
| Minikube | Latest | Cluster K8s local |
| PostgreSQL | 15 | Base de données relationnelle |
| Nginx Ingress | Latest | API Gateway / Routage |
| HTML/CSS/JS | - | Interface web Frontend |

---

## 📁 Structure du projet

```
documenthub-microservices/
├── file-service/               # Microservice 1 : gestion fichiers
│   ├── app.py                  # API REST Flask (upload, liste, suppression)
│   ├── requirements.txt        # Dépendances Python
│   └── Dockerfile              # Image Docker Python 3.11-slim
│
├── project-service/            # Microservice 2 : gestion projets
│   ├── app.py                  # API REST Flask (CRUD projets)
│   ├── requirements.txt
│   └── Dockerfile
│
├── audit-service/              # Microservice 3 : logs et traçabilité
│   ├── app.py                  # API REST Flask (logs d'audit)
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                   # Interface web
│   ├── index.html              # Page principale
│   ├── style.css               # Styles responsive
│   ├── app.js                  # Logique JavaScript
│   └── Dockerfile              # Serveur HTTP Python
│
├── k8s/                        # Manifestes Kubernetes
│   ├── file-service.yaml       # Deployment + Service
│   ├── project-service.yaml    # Deployment + Service
│   ├── audit-service.yaml      # Deployment + Service
│   ├── postgres.yaml           # Deployment + Service + PVC + Secret
│   ├── ingress.yaml            # Ingress nginx API Gateway
│   ├── rbac.yaml               # ServiceAccounts + Roles + RoleBindings
│   └── network-policy.yaml     # Network Policies
│
├── docker-compose.yml          # Test local sans K8s
└── README.md                   # Documentation
```

---

## ⚙️ Installation et déploiement

### Prérequis

- Docker Desktop installé et lancé
- Minikube installé
- kubectl installé
- Python 3.11+

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/fouadalloti/documenthub-microservices.git
cd documenthub-microservices
```

### Étape 2 : Démarrer Minikube

```bash
minikube start --driver=docker
minikube addons enable ingress
```

### Étape 3 : Connecter Docker à Minikube

```powershell
# PowerShell
& minikube -p minikube docker-env | Invoke-Expression
```

### Étape 4 : Builder les images Docker

```bash
docker build -f file-service/Dockerfile -t file-service:latest ./file-service
docker build -f project-service/Dockerfile -t project-service:latest ./project-service
docker build -f audit-service/Dockerfile -t audit-service:latest ./audit-service
docker build -f frontend/Dockerfile -t frontend:latest ./frontend
```

### Étape 5 : Déployer sur Kubernetes

```bash
kubectl apply -f k8s/rbac.yaml
kubectl apply -f k8s/network-policy.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/file-service.yaml
kubectl apply -f k8s/project-service.yaml
kubectl apply -f k8s/audit-service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/frontend.yaml
```

### Étape 6 : Vérifier le déploiement

```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

### Étape 7 : Accéder à l'application

```bash
# Terminal 1 : Ingress
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 80:80

# Terminal 2 : Frontend
kubectl port-forward service/frontend 8080:8080

# Navigateur
# http://localhost:8080       → Interface web
# http://localhost/files      → API file-service
# http://localhost/projects   → API project-service
# http://localhost/logs       → API audit-service
```

---

## 🔌 API REST Endpoints

### File Service (port 5001)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/files` | Lister tous les fichiers |
| POST | `/upload` | Uploader un fichier |
| GET | `/files/:id` | Récupérer un fichier |
| DELETE | `/files/:id` | Supprimer un fichier |
| GET | `/health` | Status du service |

### Project Service (port 5002)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/projects` | Lister tous les projets |
| POST | `/projects` | Créer un projet |
| GET | `/projects/:id` | Récupérer un projet |
| DELETE | `/projects/:id` | Supprimer un projet |
| GET | `/health` | Status du service |

### Audit Service (port 5003)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/logs` | Lister tous les logs |
| POST | `/logs` | Ajouter un log |
| GET | `/logs/:id` | Récupérer un log |
| GET | `/health` | Status du service |

---

## 🔐 Sécurité

### RBAC (Role-Based Access Control)

Chaque microservice possède son propre **ServiceAccount** avec des permissions minimales :

| ServiceAccount | Permissions |
|---------------|-------------|
| file-service-sa | get, list, watch (pods, services) |
| project-service-sa | get, list, watch (pods, services) |
| audit-service-sa | get, list, watch (pods, services, events, deployments) |

### Network Policies

- **file-service** : accepte uniquement le trafic venant de l'Ingress
- **project-service** : accepte uniquement le trafic venant de l'Ingress
- **audit-service** : accepte le trafic de tous les services internes

### Secrets Kubernetes

Les credentials PostgreSQL sont stockés dans un **Secret K8s** (base64 encodé), jamais en clair dans le code.

---

## 🗄️ Base de données

PostgreSQL 15 déployé dans Kubernetes avec :
- **PersistentVolumeClaim (PVC)** : 1Gi de stockage persistant
- **Secret K8s** : credentials sécurisés
- **ClusterIP Service** : accessible uniquement en interne au cluster

---

## 📊 Workflow Git

```
main
├── feature/add-project-audit-services  (PR #1 mergée)
├── feature/add-postgres-ingress        (PR #2 mergée)
├── feature/add-frontend                (PR #3 mergée)
└── feature/add-security-rbac           (PR #4 mergée)
```



---

## 👤 Auteur

**Fouad ALLOTI**
- Master 1 Réseaux et Systèmes Autonomes — Université Paris Cité
- GitHub : [@fouadalloti](https://github.com/fouadalloti)
- Docker Hub : [fouadalloti](https://hub.docker.com/u/fouadalloti)
