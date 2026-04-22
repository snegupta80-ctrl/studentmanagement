# Docker Installation Guide for Windows

## Method 1: Docker Desktop (Recommended for Development)

### Download
1. Go to: https://www.docker.com/products/docker-desktop
2. Click "Download for Windows - AMD64"
3. Run the installer (Docker Desktop Installer.exe)

### Installation Steps
1. **Double-click** the downloaded installer
2. **Accept** the license agreement
3. **Enable WSL 2** (Windows Subsystem for Linux) - required
4. **Click OK** to install
5. **Restart** your computer when prompted

### After Installation
1. Open Docker Desktop from Start Menu
2. Wait for "Docker Desktop is running" (whale icon in tray)
3. Test with: `docker --version`

### Common Installation Errors & Fixes

| Error | Solution |
|-------|----------|
| "WSL 2 required" | Run PowerShell as Admin: `wsl --install` |
| "Virtualization disabled" | Enable in BIOS: Intel VT-x or AMD-V |
| "Hyper-V not available" | Enable Windows feature: Turn Windows features on/off → Hyper-V |
| Installation stuck | Disable antivirus temporarily, restart, retry |
| Slow download | Use mobile hotspot or different network |

---

## Method 2: Without Docker (Run Locally)

If Docker fails, run without containers:

### Step 1: Start MongoDB
Option A - MongoDB Atlas (Cloud - FREE):
1. Go to https://www.mongodb.com/atlas
2. Sign up, create FREE cluster
3. Get connection string
4. Replace in `.env` file

Option B - Local MongoDB:
```powershell
# Download MongoDB Community Server
# https://www.mongodb.com/try/download/community
# Install and start MongoDB service
```

### Step 2: Run Backend
```powershell
cd d:\sneharepos\studentmanagement
npm install
npm start
```

### Step 3: Run Frontend (New Terminal)
```powershell
cd d:\sneharepos\studentmanagement\frontend
npm install
npm run dev
```

---

## Method 3: Alternative - Rancher Desktop (Lighter)

If Docker Desktop is too heavy:
1. Download: https://rancherdesktop.io/
2. Lighter alternative, includes docker and kubectl
3. Works same as Docker Desktop

---

## Quick Verification Commands

```powershell
# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Test with hello-world
docker run hello-world

# Build your app (after install)
cd d:\sneharepos\studentmanagement
docker-compose up
```

---

## Production Deployment Without Docker

You can deploy to Render WITHOUT Docker:

### Backend (Web Service)
- Build: `npm install`
- Start: `node server.js`

### Frontend (Static Site)
- Build: `npm run build`
- Publish: `dist` folder

See `DEPLOYMENT.md` for full steps.

---

## Which Method to Choose?

| Your Situation | Recommended Method |
|---------------|-------------------|
| Learning/Demo | Method 2 (Run Locally) |
| Team Project | Method 1 (Docker Desktop) |
| Low RAM (<8GB) | Method 3 (Rancher) or Method 2 |
| Production | Any, but Docker helps |

**For now**: Use Method 2 (Run Locally) to test everything, then install Docker when ready.
