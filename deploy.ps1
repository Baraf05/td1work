#!/usr/bin/env pwsh
# Script de déploiement automatisé : local → GitHub → Alwaysdata

param(
    [string]$Message = "Deployment auto $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    [string]$SshKey = "$env:USERPROFILE\.ssh\id_ed25519_nopass",
    [string]$AlwaysdataHost = "brf@ssh-brf.alwaysdata.net",
    [string]$RemoteDir = "~/www"
)

# Couleurs
$Green = [char]27 + '[32m'
$Red = [char]27 + '[31m'
$Yellow = [char]27 + '[33m'
$Reset = [char]27 + '[0m'

Write-Host "${Yellow}🚀 Déploiement automatisé - LocalHeb${Reset}`n"

# Étape 1 : Commit local
Write-Host "${Yellow}[1/4] Commit local sur GitHub...${Reset}"
Set-Location "$PSScriptRoot\www"
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "${Red}✗ Erreur lors de 'git add'${Reset}"
    exit 1
}
git commit -m "$Message"
if ($LASTEXITCODE -ne 0) {
    Write-Host "${Red}✗ Erreur lors du commit${Reset}"
    exit 1
}
Write-Host "${Green}✓ Commit réussi${Reset}`n"

# Étape 2 : Push vers GitHub
Write-Host "${Yellow}[2/4] Push vers GitHub...${Reset}"
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "${Red}✗ Erreur lors du push${Reset}"
    exit 1
}
Write-Host "${Green}✓ Push réussi${Reset}`n"

# Étape 3 : SSH vers Alwaysdata et pull
Write-Host "${Yellow}[3/4] Connexion SSH à Alwaysdata...${Reset}"
ssh -i "$SshKey" -o IdentitiesOnly=yes "$AlwaysdataHost" "cd $RemoteDir && git pull"

if ($LASTEXITCODE -ne 0) {
    Write-Host "${Red}✗ Erreur lors du pull sur Alwaysdata${Reset}"
    exit 1
}
Write-Host "${Green}✓ Pull sur Alwaysdata réussi${Reset}`n"

# Résumé
Write-Host "${Green}✓ Déploiement complet réussi !${Reset}`n"
Write-Host "${Yellow}Résumé :${Reset}"
Write-Host "  • Local : commit + push ✓"
Write-Host "  • Alwaysdata : pull ✓"
Write-Host "  • Date : $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')`n"
