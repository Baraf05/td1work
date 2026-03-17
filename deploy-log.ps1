#!/usr/bin/env pwsh
# Script de déploiement avec logging - LocalHeb

param(
    [string]$Message = "Deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    [string]$SshKey = "$env:USERPROFILE\.ssh\id_ed25519_nopass",
    [string]$AlwaysdataHost = "brf@ssh-brf.alwaysdata.net",
    [string]$LogFile = "deploy.log"
)

$StartTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$LogPath = "$PSScriptRoot\www\$LogFile"

# Initialiser le fichier log
@"
===============================================
  DÉPLOIEMENT LOCALWEB
===============================================
Heure début : $StartTime
Message : $Message

"@ | Set-Content -Path $LogPath

function LogStep {
    param([string]$Title)
    $Divider = "===============================================`n"
    "  $Title`n$Divider" | Add-Content -Path $LogPath
}

Write-Host "`n`🚀 Déploiement automatisé avec logging`n"

# ÉTAPE 1 : COMMIT
LogStep "[1/4] COMMIT LOCAL"
Set-Location "$PSScriptRoot\www"

Write-Host "Exécution: git add ."
"$ git add ." | Add-Content -Path $LogPath
git add . 2>&1 | Add-Content -Path $LogPath
"" | Add-Content -Path $LogPath

Write-Host "Exécution: git commit -m '$Message'"
"$ git commit -m '$Message'" | Add-Content -Path $LogPath
git commit -m "$Message" 2>&1 | Add-Content -Path $LogPath
"" | Add-Content -Path $LogPath

if ($LASTEXITCODE -ne 0) {
    "❌ ERREUR: git commit échoué" | Add-Content -Path $LogPath
    exit 1
}
Write-Host "✓ Commit réussi"
"✓ Commit réussi" | Add-Content -Path $LogPath

# ÉTAPE 2 : PUSH
LogStep "[2/4] PUSH GITHUB"
Write-Host "Exécution: git push origin main"
"$ git push origin main" | Add-Content -Path $LogPath
git push origin main 2>&1 | Add-Content -Path $LogPath
"" | Add-Content -Path $LogPath

if ($LASTEXITCODE -ne 0) {
    "❌ ERREUR: git push échoué" | Add-Content -Path $LogPath
    exit 1
}
Write-Host "✓ Push réussi"
"✓ Push réussi" | Add-Content -Path $LogPath

# ÉTAPE 3 : PULL ALWAYSDATA
LogStep "[3/4] PULL ALWAYSDATA"
Write-Host "Exécution: ssh vers Alwaysdata"
"$ ssh vers Alwaysdata et git pull" | Add-Content -Path $LogPath

$PullOutput = ssh -i "$SshKey" -o IdentitiesOnly=yes "$AlwaysdataHost" "cd ~/www && git pull" 2>&1
$PullOutput | Add-Content -Path $LogPath
"" | Add-Content -Path $LogPath

if ($LASTEXITCODE -ne 0) {
    "❌ ERREUR: git pull échoué sur Alwaysdata" | Add-Content -Path $LogPath
    exit 1
}
Write-Host "✓ Pull réussi sur Alwaysdata"
"✓ Pull réussi sur Alwaysdata" | Add-Content -Path $LogPath

# RÉSUMÉ FINAL
LogStep "✓ DÉPLOIEMENT COMPLET"
$EndTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"Heure fin : $EndTime" | Add-Content -Path $LogPath
"" | Add-Content -Path $LogPath

Write-Host "✓ Tous les déploiements réussis !`n"
Write-Host "Fichier log: $LogPath`n"

# Afficher le log
Write-Host "--- Contenu du log ---"
Get-Content -Path $LogPath | Select-Object -Last 20

