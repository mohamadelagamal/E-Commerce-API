# Quick Start - Push to GitHub and Deploy
# Run this script to initialize Git and push your project to GitHub

Write-Host "🚀 E-Commerce Backend - GitHub Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📝 Please enter your GitHub username:" -ForegroundColor Yellow
$githubUsername = Read-Host

Write-Host ""
Write-Host "📝 Please enter your repository name (default: ecommerce-backend):" -ForegroundColor Yellow
$repoName = Read-Host
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "ecommerce-backend"
}

Write-Host ""
Write-Host "🔍 Checking if Git repository is already initialized..." -ForegroundColor Cyan

if (Test-Path ".git") {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
} else {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Adding files to Git..." -ForegroundColor Cyan
git add .

Write-Host ""
Write-Host "💾 Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit - E-Commerce Backend with MongoDB Atlas"

Write-Host ""
Write-Host "🌿 Setting main branch..." -ForegroundColor Cyan
git branch -M main

Write-Host ""
Write-Host "🔗 Adding remote repository..." -ForegroundColor Cyan
$remoteUrl = "https://github.com/$githubUsername/$repoName.git"
Write-Host "Remote URL: $remoteUrl" -ForegroundColor Gray

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "⚠️  Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    Write-Host "Do you want to update it? (y/n):" -ForegroundColor Yellow
    $updateRemote = Read-Host
    if ($updateRemote -eq "y" -or $updateRemote -eq "Y") {
        git remote set-url origin $remoteUrl
        Write-Host "✅ Remote updated" -ForegroundColor Green
    }
} else {
    git remote add origin $remoteUrl
    Write-Host "✅ Remote added" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "⚠️  You may need to enter your GitHub credentials" -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin main
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://github.com/$githubUsername/$repoName" -ForegroundColor White
    Write-Host "2. Follow the DEPLOYMENT_GUIDE.md to set up GitHub Actions" -ForegroundColor White
    Write-Host "3. Configure GitHub Secrets for automatic deployment" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Please make sure:" -ForegroundColor Yellow
    Write-Host "1. You have created the repository on GitHub: https://github.com/new" -ForegroundColor White
    Write-Host "2. Your GitHub credentials are correct" -ForegroundColor White
    Write-Host "3. You have internet connection" -ForegroundColor White
    Write-Host ""
    Write-Host "Manual push command:" -ForegroundColor Yellow
    Write-Host "git push -u origin main" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
