# Render Deployment Guide

## Prerequisites

- Render account (https://render.com)
- MongoDB Atlas account (https://mongodb.com/atlas)
- Cloudinary account (https://cloudinary.com)
- GitHub repository with your code

---

## Method 1: Normal Deployment (Recommended)

### Step 1: Setup MongoDB Atlas

1. Create a free cluster at MongoDB Atlas
2. Create a database user
3. Get your connection string (format):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/student_management?retryWrites=true&w=majority
   ```
4. Whitelist all IPs (0.0.0.0/0) or Render's IP ranges

### Step 2: Setup Cloudinary

1. Sign up at Cloudinary
2. Go to Dashboard
3. Note down:
   - Cloud Name
   - API Key
   - API Secret

### Step 3: Deploy Backend (Web Service)

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `student-management-api`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<generate-a-random-string>
   JWT_EXPIRE=7d
   CLIENT_URL=<your-frontend-url-after-deployment>
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   ```
5. Click "Create Web Service"

### Step 4: Deploy Frontend (Static Site)

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect the same repository
3. Configure:
   - **Name**: `student-management-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://student-management-api.onrender.com/api
   VITE_SOCKET_URL=https://student-management-api.onrender.com
   ```
5. Click "Create Static Site"

### Step 5: Update CORS

After frontend is deployed, update backend's `CLIENT_URL` env var with the actual frontend URL.

---

## Method 2: Docker Deployment

### Deploy Backend with Docker

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your repository
3. Select "Docker" as runtime
4. Configure:
   - **Name**: `student-management-api`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.`
5. Add same environment variables as Method 1
6. Click "Create Web Service"

---

## Environment Variables Reference

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret-key` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `https://...onrender.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `secret-string` |

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://.../api` |
| `VITE_SOCKET_URL` | Backend URL for Socket.IO | `https://...` |

---

## Common Errors & Fixes

### CORS Errors
**Symptom**: `Access-Control-Allow-Origin` errors in browser console

**Fix**: 
- Ensure `CLIENT_URL` in backend matches actual frontend URL exactly
- Check for trailing slashes mismatch
- Update CORS origin in `app.js` if needed

### Port Issues
**Symptom**: `Error: listen EADDRINUSE` or connection refused

**Fix**:
- Use `PORT` env var (Render assigns dynamic ports)
- Don't hardcode port numbers
- Ensure `server.js` uses `process.env.PORT || 5000`

### Build Failures
**Symptom**: Frontend build fails on Render

**Fix**:
- Ensure `vite` is in `devDependencies` (not just `dependencies`)
- Check build command is correct: `npm run build`
- Verify `dist` folder is in `.gitignore` locally but gets created during build

### MongoDB Connection Failures
**Symptom**: `MongooseServerSelectionError` or timeout

**Fix**:
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format (must include database name)
- Ensure credentials are URL-encoded (special characters in password)

### Socket.IO Connection Issues
**Symptom**: Real-time updates not working in production

**Fix**:
- Use same domain for API and Socket (Render web services handle both)
- Ensure CORS config includes the frontend URL
- Check that `transports: ['websocket', 'polling']` is set in client

### File Upload Failures
**Symptom**: Cloudinary uploads fail

**Fix**:
- Verify all Cloudinary env vars are set correctly
- Check that `multer` is configured correctly
- Ensure file size limits aren't exceeded

---

## Post-Deployment Checklist

- [ ] Backend health check endpoint works
- [ ] Frontend loads without console errors
- [ ] Login/register functionality works
- [ ] CRUD operations work for students
- [ ] Real-time updates via WebSocket work
- [ ] Image upload to Cloudinary works
- [ ] Student images display correctly
- [ ] Logout works properly
- [ ] Responsive design works on mobile

---

## Using Blueprint (render.yaml)

1. Push `render.yaml` to your repository root
2. In Render Dashboard, click "Blueprints" → "New Blueprint"
3. Connect your repository
4. Render will create all services automatically
5. Fill in the `sync: false` environment variables manually
