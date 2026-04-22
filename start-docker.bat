@echo off
chcp 65001
cls
echo ========================================
echo Student Management System - Docker
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed!
    echo.
    echo Please install Docker Desktop:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running!
    echo.
    echo Please start Docker Desktop and wait for it to be ready.
    echo.
    pause
    exit /b 1
)

echo ✅ Docker is ready
echo.

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo Creating from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  Please edit .env file with your actual values!
    echo    - MongoDB URI
    echo    - JWT Secret
    echo    - Cloudinary credentials
    echo.
    pause
)

echo Starting services...
echo ========================================
docker-compose up --build

echo.
echo ========================================
echo Services stopped
echo ========================================
pause
