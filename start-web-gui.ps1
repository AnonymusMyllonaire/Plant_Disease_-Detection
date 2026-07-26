# Add Node.js to PATH
$env:Path += ";C:\Program Files\nodejs"

# Navigate to project directory
Set-Location $PSScriptRoot

# Start Backend (API) in a new window
Write-Host "Starting Backend API..." -ForegroundColor Green
Start-Process python -ArgumentList "api.py" -WorkingDirectory $PSScriptRoot

# Install dependencies (if needed)
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Green
    npm install
}

# Start Frontend
Write-Host "Starting Web GUI..." -ForegroundColor Green
npm run dev
