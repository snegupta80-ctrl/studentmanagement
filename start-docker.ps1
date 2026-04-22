# Student Management System - Docker Startup Script
# Run with: .\start-docker.ps1

$ErrorActionPreference = "Stop"

function Write-Status {
    param($Message, $Type = "Info")
    switch ($Type) {
        "Success" { Write-Host "✅ $Message" -ForegroundColor Green }
        "Warning" { Write-Host "⚠️  $Message" -ForegroundColor Yellow }
        "Error" { Write-Host "❌ $Message" -ForegroundColor Red }
        "Info" { Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
    }
}

function Test-Docker {
    try {
        $null = docker --version 2>$null
        $null = docker info 2>$null
        return $true
    } catch {
        return $false
    }
}

function Test-EnvFile {
    return Test-Path .env
}

Clear-Host
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Student Management System - Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Status "Checking Docker installation..." "Info"
if (-not (Test-Docker)) {
    Write-Status "Docker is not installed or not running!" "Error"
    Write-Host ""
    Write-Host "Please install Docker Desktop:" -ForegroundColor Yellow
    Write-Host "https://www.docker.com/products/docker-desktop" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use the local development setup without Docker." -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Status "Docker is installed and running" "Success"

# Check .env file
Write-Status "Checking environment configuration..." "Info"
if (-not (Test-EnvFile)) {
    Write-Status ".env file not found!" "Warning"
    Write-Status "Creating from .env.example..." "Info"
    
    Copy-Item .env.example .env
    
    Write-Host ""
    Write-Status "Please edit .env file with your actual values:" "Warning"
    Write-Host "   - MONGODB_URI (MongoDB connection string)" -ForegroundColor Yellow
    Write-Host "   - JWT_SECRET (random secret key)" -ForegroundColor Yellow
    Write-Host "   - CLOUDINARY_CLOUD_NAME" -ForegroundColor Yellow
    Write-Host "   - CLOUDINARY_API_KEY" -ForegroundColor Yellow
    Write-Host "   - CLOUDINARY_API_SECRET" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after editing .env file"
    
    # Re-check
    if (-not (Test-EnvFile)) {
        Write-Status ".env file still not found!" "Error"
        exit 1
    }
}
Write-Status "Environment configuration ready" "Success"

# Start Docker Compose
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Status "Starting all services..." "Info"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services will be available at:" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:5000/health" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

try {
    docker-compose up --build
} catch {
    Write-Status "Error starting Docker services: $_" "Error"
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Yellow
    Write-Host "1. Check if ports 80, 5000, 27017 are free" -ForegroundColor White
    Write-Host "2. Run: docker-compose down -v" -ForegroundColor White
    Write-Host "3. Try again: docker-compose up --build" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Status "Services stopped" "Info"
Write-Host "========================================" -ForegroundColor Cyan
