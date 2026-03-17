#!/bin/bash
# Script de déploiement - Version Bash
# Utilisation: ./deploy.sh [message]

MESSAGE=${1:-"Auto-deploy $(date '+%Y-%m-%d %H:%M:%S')"}
SSH_KEY="$HOME/.ssh/id_ed25519_nopass"
ALWAYSDATA_HOST="brf@ssh-brf.alwaysdata.net"
REMOTE_DIR="~/www"

echo "🚀 Déploiement automatisé - LocalHeb"
echo ""

# Étape 1 : Commit local
echo "📝 [1/4] Commit local..."
cd "$(dirname "$0")/www"
git add .
git commit -m "$MESSAGE"
if [ $? -ne 0 ]; then
    echo "✗ Erreur lors du commit"
    exit 1
fi
echo "✓ Commit réussi"
echo ""

# Étape 2 : Push vers GitHub
echo "📤 [2/4] Push vers GitHub..."
git push origin main
if [ $? -ne 0 ]; then
    echo "✗ Erreur lors du push"
    exit 1
fi
echo "✓ Push réussi"
echo ""

# Étape 3 : Pull sur Alwaysdata
echo "🔄 [3/4] Pull sur Alwaysdata..."
ssh -i "$SSH_KEY" -o IdentitiesOnly=yes "$ALWAYSDATA_HOST" << 'EOF'
cd ~/www
git pull
echo "✓ Pull réussi"
EOF

if [ $? -ne 0 ]; then
    echo "✗ Erreur lors du pull"
    exit 1
fi
echo ""

# Résumé
echo "✓ Déploiement complet réussi !"
echo ""
echo "Résumé :"
echo "  • Local : commit + push ✓"
echo "  • Alwaysdata : pull ✓"
echo "  • Date : $(date '+%d/%m/%Y %H:%M:%S')"
echo ""
