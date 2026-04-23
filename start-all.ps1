# Start Both Servers - Student Management System
$host.ui.RawUI.WindowTitle = "StudentMS - Backend + Frontend"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Student Management System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill any existing Node processes
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Start Backend
Write-Host "`n[1/2] Starting Backend Server..." -ForegroundColor Green
$backend = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd d:\sneharepos\studentmanagement; node server.js" -PassThru
Write-Host "Backend starting on port 5000..." -ForegroundColor Gray

# Wait for backend to be ready
Write-Host "Waiting for backend to be ready..." -ForegroundColor Gray
$retries = 30
while ($retries -gt 0) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "Backend is READY!" -ForegroundColor Green
            break
        }
    } catch {
        $retries--
        Start-Sleep -Seconds 1
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
}

if ($retries -eq 0) {
    Write-Host "`nBackend failed to start!" -ForegroundColor Red
    exit 1
}

# Start Frontend
Write-Host "`n[2/2] Starting Frontend Server..." -ForegroundColor Green
$frontend = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd d:\sneharepos\studentmanagement\frontend; npm run dev" -PassThru
Write-Host "Frontend starting on port 5173..." -ForegroundColor Gray

# Wait for frontend
Start-Sleep -Seconds 5

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  BOTH SERVERS RUNNING!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nBackend:  http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "`nOpening browser..." -ForegroundColor Yellow

# Open browser
Start-Process "http://localhost:5173"

Write-Host "`nPress any key to STOP both servers..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Write-Host "`nStopping servers..." -ForegroundColor Yellow
Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "Servers stopped." -ForegroundColor Green
