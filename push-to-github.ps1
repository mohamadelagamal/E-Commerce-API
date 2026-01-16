# GitHub Setup and Push Script for E-Commerce Backend
# This script will help you push your project to GitHub

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  E-Commerce Backend - GitHub Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Step 1: Check Git Status" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check if git is initialized
if (Test-Path ".git") {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}
else {
    Write-Host "⚠️ Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Step 2: Add Files to Git" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Add all files
Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .

# Show status
Write-Host ""
Write-Host "Files to be committed:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Step 3: Commit Changes" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Commit
$commitMessage = "Initial commit - E-Commerce Backend with MongoDB Atlas integration"
Write-Host "Committing with message: $commitMessage" -ForegroundColor Yellow
git commit -m "$commitMessage"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Step 4: Set Main Branch" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

git branch -M main
Write-Host "✅ Branch set to 'main'" -ForegroundColor Green

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Step 5: Add Remote Repository" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$repoUrl = "https://github.com/mohamadelagamal/E-Commerce-API.git"

# Check if remote already exists
$remoteExists = git remote get-url origin 2>$null

if ($remoteExists) {
    Write-Host "⚠️ Remote 'origin' already exists: $remoteExists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to update it? (y/n)"
    if ($response -eq "y") {
        git remote set-url origin $repoUrl
        Write-Host "✅ Remote updated to: $repoUrl" -ForegroundColor Green
    }
}
else {
    git remote add origin $repoUrl
    Write-Host "✅ Remote added: $repoUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Step 6: Push to GitHub" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "⚠️ IMPORTANT: You may need to authenticate with GitHub" -ForegroundColor Yellow
Write-Host "If you haven't set up authentication, you'll need a Personal Access Token (PAT)" -ForegroundColor Yellow
Write-Host ""
Write-Host "To create a PAT:" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "2. Click 'Generate new token (classic)'" -ForegroundColor White
Write-Host "3. Select 'repo' scope" -ForegroundColor White
Write-Host "4. Generate and copy the token" -ForegroundColor White
Write-Host "5. Use the token as your password when prompted" -ForegroundColor White
Write-Host ""

$response = Read-Host "Ready to push to GitHub? (y/n)"

if ($response -eq "y") {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    
    try {
        git push -u origin main
        
        Write-Host ""
        Write-Host "=========================================" -ForegroundColor Green
        Write-Host "  ✅ SUCCESS!" -ForegroundColor Green
        Write-Host "=========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your code has been pushed to GitHub!" -ForegroundColor Green
        Write-Host "Repository: $repoUrl" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://github.com/mohamadelagamal/E-Commerce-API" -ForegroundColor White
        Write-Host "2. Set up GitHub Secrets for Hostinger deployment" -ForegroundColor White
        Write-Host "3. See HOSTINGER_DEPLOYMENT.md for detailed instructions" -ForegroundColor White
        Write-Host ""
        
    }
    catch {
        Write-Host ""
        Write-Host "❌ Push failed!" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Common solutions:" -ForegroundColor Yellow
        Write-Host "1. Make sure you have access to the repository" -ForegroundColor White
        Write-Host "2. Use a Personal Access Token instead of password" -ForegroundColor White
        Write-Host "3. Check if the repository exists on GitHub" -ForegroundColor White
        Write-Host ""
    }
}
else {
    Write-Host ""
    Write-Host "⚠️ Push cancelled. You can push manually later with:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Script Completed" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
