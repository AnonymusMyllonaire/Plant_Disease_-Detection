# Quick Start Scripts

## For Web GUI

### Method 1: Use the Script (Easiest)
```powershell
.\start-web-gui.ps1
```

### Method 2: Manual Commands
Run these commands **in order** in PowerShell:
```powershell
# 1. Add Node.js to PATH
$env:Path += ";C:\Program Files\nodejs"

# 2. Make sure you're in the project directory
cd "d:\p\Cortexis\Weak 2\plant disease"

# 3. Install dependencies (first time only)
npm install

# 4. Start the web server
npm run dev
```

## For Desktop GUI (No Node.js needed!)
```powershell
python gui_app.py
```

## For API Server
```powershell
python api.py
```

## Important Notes

- **The PATH fix is temporary** - it only lasts for your current PowerShell session
- **To make it permanent**: Restart your computer after installing Node.js
- **If you close PowerShell**: You'll need to run the PATH command again

## Recommended: Just Use the Desktop GUI!

The desktop GUI (`gui_app.py`) has all the same features and doesn't require Node.js setup:
- ✅ Beautiful dark mode UI
- ✅ Upload files or use camera
- ✅ Real-time predictions
- ✅ Confidence bars
- ✅ Symptoms and treatment info

Run it with: `python gui_app.py`
