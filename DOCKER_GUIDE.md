# Docker Complete Guide

## What is Docker?

**Docker** is a platform that packages applications into standardized units called **containers**. Think of it like shipping containers for software - everything your app needs (code, runtime, system tools, libraries) is packaged together.

### Why Use Docker?

1. **Consistency**: Your app runs exactly the same on your laptop, test server, and production
2. **Isolation**: Each app runs in its own container without interfering with others
3. **Portability**: Run containers anywhere Docker is installed
4. **Efficiency**: Containers share the OS kernel, making them lightweight
5. **Scalability**: Easy to spin up multiple instances

### Containers vs Virtual Machines

```
┌─────────────────────────────────────────────────────────────┐
│  Traditional VMs                     Docker Containers     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐             ┌─────────────────┐    │
│  │   App   │ │   App   │             │  ┌─────────┐    │    │
│  │   +     │ │   +     │             │  │   App   │    │    │
│  │  Libs   │ │  Libs   │             │  │  + Libs │    │    │
│  │   +     │ │   +     │             │  ├─────────┤    │    │
│  │  Guest  │ │  Guest  │             │  │   App   │    │    │
│  │   OS    │ │   OS    │             │  │  + Libs │    │    │
│  ├─────────┤ ├─────────┤             │  ├─────────┤    │    │
│  │ Hyper-  │ │ Hyper-  │             │  │   App   │    │    │
│  │  visor  │ │  visor  │             │  │  + Libs │    │    │
│  ├─────────┴───────────┤             │  ├─────────┤    │    │
│  │    Host OS          │             │  │  Docker │    │    │
│  │  (Infrastructure)   │             │  │ Engine  │    │    │
│  └─────────────────────┘             │  ├─────────┤    │    │
│                                      │  │  Host   │    │    │
│                                      │  │   OS    │    │    │
│                                      │  └─────────┘    │    │
│                                      └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘

VMs: Heavy (GBs), Slow boot (minutes), Full OS per VM
Containers: Lightweight (MBs), Fast boot (seconds), Shared OS kernel
```

### When to Use Docker?

✅ **Use Docker when:**
- Working in a team (ensures same environment)
- Deploying to production (consistent deployments)
- Running microservices (isolated services)
- Need to scale quickly (spin up/down containers)
- CI/CD pipelines (automated testing/deployment)

❌ **Don't need Docker when:**
- Simple single-page apps
- Learning/development (can use local setup)
- Prototyping (adds complexity)
- Very limited resources (Docker needs RAM)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Host (Your PC)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Docker Compose Network                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  MongoDB    │  │   Backend   │  │  Frontend   │  │   │
│  │  │  (Database) │◄─┤  (Node.js)  │◄─┤   (React)   │  │   │
│  │  │   :27017    │  │   :5000     │  │    :80      │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │        │                 │                │         │   │
│  │        └─────────────────┴────────────────┘         │   │
│  │                  Shared Network                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Flow:
1. User accesses Frontend at http://localhost
2. Frontend calls Backend API at http://localhost:5000/api
3. Backend stores/retrieves data from MongoDB
4. All services communicate via Docker network
```

---

## Quick Start Commands

### 1. Build and Start Everything
```bash
# Build images and start containers
docker-compose up --build

# Start in background (detached mode)
docker-compose up -d

# View logs
docker-compose logs -f
```

### 2. View Running Containers
```bash
# List all containers
docker ps

# List all containers (including stopped)
docker ps -a

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### 3. Stop Everything
```bash
# Stop containers (keeps data)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything including volumes (⚠️ deletes data)
docker-compose down -v
```

### 4. Rebuild After Code Changes
```bash
# Rebuild specific service
docker-compose up --build backend

# Rebuild everything
docker-compose up --build
```

### 5. Execute Commands Inside Containers
```bash
# Open shell in backend container
docker-compose exec backend sh

# Run database migrations
docker-compose exec backend node migrate.js

# View MongoDB shell
docker-compose exec mongodb mongosh
```

---

## File Structure

```
studentmanagement/
├── Dockerfile                    # Backend container definition
├── docker-compose.yml           # Production orchestration
├── docker-compose.override.yml  # Development overrides
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example env file
├── .dockerignore               # Files to exclude from Docker build
├── frontend/
│   ├── Dockerfile              # Frontend container definition
│   ├── nginx.conf              # Nginx configuration
│   └── .dockerignore          # Frontend ignore rules
└── DOCKER_GUIDE.md            # This file
```

---

## Common Docker Commands

### Images
```bash
# List images
docker images

# Remove image
docker rmi <image-id>

# Remove all unused images
docker image prune -a
```

### Containers
```bash
# Start container
docker start <container-id>

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# Force remove running container
docker rm -f <container-id>

# Remove all stopped containers
docker container prune
```

### Volumes
```bash
# List volumes
docker volume ls

# Remove volume
docker volume rm <volume-name>

# Remove all unused volumes
docker volume prune
```

### System Cleanup
```bash
# Remove everything (containers, images, volumes, networks)
docker system prune -a --volumes
```

---

## Environment Configuration

### Development (Default)
```bash
# Uses docker-compose.yml + docker-compose.override.yml
docker-compose up

# Features:
# - Hot reload enabled
# - Volume mounts for live code editing
# - Debug logging enabled
# - Local MongoDB with Docker
```

### Production
```bash
# Use only production compose file
docker-compose -f docker-compose.yml up -d

# Features:
# - Optimized builds
# - No volume mounts (immutable containers)
# - Health checks enabled
# - Production MongoDB Atlas
```

---

## Troubleshooting

### Issue: Port Already in Use
**Error:** `bind: address already in use`

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or use different port in docker-compose.yml
ports:
  - "5001:5000"  # Maps host 5001 to container 5000
```

### Issue: MongoDB Connection Failed
**Error:** `MongooseServerSelectionError`

**Solution:**
```bash
# Check MongoDB container status
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# Check if authentication is correct
docker-compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

### Issue: Changes Not Reflecting
**Cause:** Cached layers or volume issues

**Solution:**
```bash
# Force rebuild without cache
docker-compose build --no-cache

# Or clean everything and restart
docker-compose down -v
docker-compose up --build
```

### Issue: Permission Denied (Linux/Mac)
**Error:** `EACCES: permission denied`

**Solution:**
```bash
# Fix volume permissions
sudo chown -R $USER:$USER .

# Or use named volumes instead of bind mounts
```

### Issue: Slow Build Times
**Solution:**
```bash
# Use BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Or in docker-compose.yml
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    # ...
```

### Issue: Container Exits Immediately
**Check logs:**
```bash
docker-compose logs <service-name>

# Example
docker-compose logs backend
```

**Common causes:**
- Missing environment variables
- Database not ready (add `depends_on`)
- Port conflicts
- Code errors on startup

---

## Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# View health check logs
docker-compose logs backend | grep health
```

**Backend Health Check:**
- Endpoint: `GET /health`
- Returns: `{ status: "OK", timestamp, service, uptime }`

**Frontend Health Check:**
- Endpoint: `GET /`
- Returns: 200 OK when Nginx is serving

**MongoDB Health Check:**
- Command: `db.runCommand("ping")`
- Verifies database is accepting connections

---

## Deployment to Production

### Step 1: Prepare Environment
```bash
# Copy example env and fill in production values
cp .env.example .env
# Edit .env with production values
```

### Step 2: Build Production Images
```bash
# Build without development overrides
docker-compose -f docker-compose.yml build
```

### Step 3: Push to Registry (Optional)
```bash
# Tag images
docker tag studentmanagement_backend:latest your-registry/backend:v1.0
docker tag studentmanagement_frontend:latest your-registry/frontend:v1.0

# Push
docker push your-registry/backend:v1.0
docker push your-registry/frontend:v1.0
```

### Step 4: Deploy on Server
```bash
# Pull images on production server
docker-compose -f docker-compose.yml pull

# Start production stack
docker-compose -f docker-compose.yml up -d
```

---

## Docker + Render Deployment

See `DEPLOYMENT.md` for full Render deployment guide using Docker.

Quick steps:
1. Push code to GitHub
2. Connect Render to your repo
3. Select "Docker" as runtime
4. Render uses your Dockerfile automatically

---

## Security Best Practices

1. **Non-root users**: All containers run as non-root (nodejs, nginxuser)
2. **No secrets in images**: Use environment variables or secrets management
3. **Health checks**: All services have health checks
4. **Security headers**: Nginx includes security headers
5. **Read-only filesystems**: Where possible, use read-only root
6. **Minimal base images**: Using alpine variants (small attack surface)

---

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Hub](https://hub.docker.com/) - Find base images

---

## Next Steps

1. **Install Docker Desktop**: https://www.docker.com/products/docker-desktop
2. **Copy .env**: `cp .env.example .env` and fill in your values
3. **Run**: `docker-compose up`
4. **Access**: http://localhost (frontend) and http://localhost:5000 (API)

Your production-ready system with WebSockets, Cloudinary, and Docker is ready!
