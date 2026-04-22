# Student Management System - Docker Makefile
# Provides convenient shortcuts for Docker commands

.PHONY: help build up down logs shell clean restart status

# Default target
help:
	@echo "Available commands:"
	@echo "  make build     - Build all Docker images"
	@echo "  make up        - Start all services"
	@echo "  make down      - Stop all services"
	@echo "  make restart   - Restart all services"
	@echo "  make logs      - View logs from all services"
	@echo "  make shell     - Open shell in backend container"
	@echo "  make clean     - Remove all containers and volumes (⚠️ deletes data)"
	@echo "  make status    - Show running containers"
	@echo "  make prod      - Start in production mode"

# Build all images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Start with build
up-build:
	docker-compose up --build -d

# Stop all services
down:
	docker-compose down

# Stop and remove volumes (⚠️ deletes data)
clean:
	docker-compose down -v --rmi all --remove-orphans

# Restart services
restart:
	docker-compose restart

# View logs
logs:
	docker-compose logs -f

# View specific service logs
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f mongodb

# Open shell in containers
shell-backend:
	docker-compose exec backend sh

shell-db:
	docker-compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# Show status
status:
	docker-compose ps

# Production mode
prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Development mode (with hot reload)
dev:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up

# Rebuild specific service
rebuild-backend:
	docker-compose up -d --build backend

rebuild-frontend:
	docker-compose up -d --build frontend

# Pull latest images
pull:
	docker-compose pull

# System prune (cleanup)
prune:
	docker system prune -a --volumes -f
