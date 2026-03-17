#!/usr/bin/env pwsh
# Alternative : Script avec heredoc SSH (méthode EOF)

param(
    [string]$Message = "Auto-deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    [string]$SshKey = "$env:USERPROFILE\.ssh\id_ed25519_nopass",
    [string]$AlwaysdataHost = "brf@ssh-brf.alwaysdata.net"
)

Write-Host "🚀 Déploiement avec méthode heredoc SSH`n"

# Étape 1 & 2 : Commit et push local
Write-Host "📤 Étape 1-2 : Commit + Push local..."
cd "$PSScriptRoot\www"
git add . && git commit -m "$Message" && git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Réussi`n"
} else {
    Write-Host "✗ Erreur"
    exit 1
}

# Étape 3 : Pull sur Alwaysdata via heredoc
Write-Host "🔄 Étape 3 : Pull sur Alwaysdata..."
ssh -i "$SshKey" -o IdentitiesOnly=yes "$AlwaysdataHost" << 'DEPLOY'
cd ~/www
git pull
echo "✓ Pull terminé sur Alwaysdata"
DEPLOY

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Déploiement complet !`n"
} else {
    Write-Host "`n✗ Erreur sur Alwaysdata"
    exit 1
}
