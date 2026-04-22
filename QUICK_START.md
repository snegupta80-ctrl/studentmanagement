# Quick Start - No Docker Required

## Step 1: Setup MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/atlas
2. Sign up with Google/GitHub
3. Click "Create" → "FREE Shared Cluster"
4. Wait 1-2 minutes for cluster creation
5. Click "Database Access" → "Add New Database User"
   - Username: `admin`
   - Password: Generate or set your own
   - Click "Add User"
6. Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
7. Click "Database" → "Connect" → "Drivers" → "Node.js"
8. Copy the connection string (replace `<password>` with your actual password)
9. Paste in `config/.ENV` file

## Step 2: Setup Cloudinary (3 minutes)

1. Go to https://cloudinary.com
2. Sign up (free tier)
3. Go to Dashboard
4. Note down:
   - Cloud Name
   - API Key
   - API Secret
5. Update `config/.ENV` file with these values

## Step 3: Install Dependencies

### Backend
```powershell
cd d:\sneharepos\studentmanagement
npm install
```

### Frontend
```powershell
cd d:\sneharepos\studentmanagement\frontend
npm install
```

## Step 4: Start Everything

### Terminal 1 - Backend
```powershell
cd d:\sneharepos\studentmanagement
npm start
```

### Terminal 2 - Frontend
```powershell
cd d:\sneharepos\studentmanagement\frontend
npm run dev
```

## Step 5: Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Common Errors & Fixes

### "Cannot find module"
```powershell
npm install
```

### "MongoDB connection failed"
- Check your MongoDB Atlas connection string
- Ensure IP whitelist includes 0.0.0.0/0
- Check username/password are correct

### "Port already in use"
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### "CORS error"
- Make sure backend is running
- Check CLIENT_URL in backend .env matches frontend URL

## Features Available

✅ User authentication (JWT)
✅ Student CRUD operations
✅ Real-time updates (WebSockets)
✅ Image uploads (Cloudinary)
✅ Responsive design (Tailwind)

## Deploy to Render (When Ready)

See `DEPLOYMENT.md` for step-by-step guide.

## Docker (Optional Later)

When you want Docker:
1. Install Docker Desktop: https://docker.com/products/docker-desktop
2. Run: `docker-compose up`

Everything works WITHOUT Docker too!
