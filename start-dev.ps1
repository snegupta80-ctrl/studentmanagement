# Student Management System - Development Startup Script
# Run this in PowerShell: .\start-dev.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Student Management System - Dev Startup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a process is running
function Test-ProcessRunning {
    param($ProcessName)
    return Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
}

# Function to start backend
function Start-Backend {
    Write-Host "Starting Backend Server..." -ForegroundColor Yellow
    $backendJob = Start-Job -ScriptBlock {
        Set-Location "d:\sneharepos\studentmanagement"
        npm start 2>&1
    }
    Start-Sleep 3
    
    # Check if backend started
    $backendProcess = Test-ProcessRunning -ProcessName "node"
    if ($backendProcess) {
        Write-Host "✅ Backend running on http://localhost:5000" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend failed to start. Check for errors above." -ForegroundColor Red
    }
    return $backendJob
}

# Function to start frontend
function Start-Frontend {
    Write-Host "Starting Frontend Dev Server..." -ForegroundColor Yellow
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location "d:\sneharepos\studentmanagement\frontend"
        npm run dev 2>&1
    }
    Start-Sleep 5
    
    Write-Host "✅ Frontend should be on http://localhost:5173" -ForegroundColor Green
    return $frontendJob
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check if MongoDB is needed
if ($env:MONGODB_URI -match "localhost") {
    Write-Host "⚠️  Using local MongoDB. Make sure MongoDB is running!" -ForegroundColor Yellow
    Write-Host "   Or change MONGODB_URI to MongoDB Atlas in .env file" -ForegroundColor Gray
}

# Check Node.js
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js not found! Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green

# Start services
$backend = Start-Backend
$frontend = Start-Frontend

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Services Starting..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Show logs
while ($true) {
    $backendLog = Receive-Job -Job $backend
    $frontendLog = Receive-Job -Job $frontend
    
    if ($backendLog) { Write-Host "[BACKEND] $backendLog" -ForegroundColor Blue }
    if ($frontendLog) { Write-Host "[FRONTEND] $frontendLog" -ForegroundColor Magenta }
    
    Start-Sleep 1
}

# Cleanup
Stop-Job -Job $backend, $frontend -ErrorAction SilentlyContinue
Remove-Job -Job $backend, $frontend -ErrorAction SilentlyContinue
