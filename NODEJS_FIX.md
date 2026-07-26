# Node.js Installation Issue - Quick Fix Guide

## Problem
Node.js was installed but PowerShell doesn't recognize `npm` or `node` commands.

## Solution Options

### Option A: Restart Your Computer (Most Reliable)
1. Save all your work
2. Restart your computer
3. Open a NEW PowerShell window
4. Navigate to project: `cd "d:\p\Cortexis\Weak 2\plant disease"`
5. Try: `npm run dev`

### Option B: Refresh Environment Variables (Quick Fix)
Run this in PowerShell:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```
Then try: `npm run dev`

### Option C: Use Full Path (Temporary)
If Node.js is installed at `C:\Program Files\nodejs\`:
```powershell
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev
```

### Option D: Use Desktop GUI Instead (Works Now!)
You don't need Node.js for the desktop version:
```bash
python gui_app.py
```

## Verify Node.js Installation
Check if Node.js is actually installed:
```powershell
# Check if files exist
Test-Path "C:\Program Files\nodejs\node.exe"
Test-Path "C:\Program Files (x86)\nodejs\node.exe"

# If found, add to PATH manually
$env:Path += ";C:\Program Files\nodejs"
```

## Why This Happens
- PowerShell loads environment variables (PATH) only when it starts
- Installing Node.js updates the PATH, but existing terminals don't see it
- You need a fresh terminal session or computer restart

## Recommended Action
**Just restart your computer** - it's the simplest and most reliable solution!
