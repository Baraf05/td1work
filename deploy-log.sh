#!/bin/bash
# Script de déploiement avec logging - LocalHeb (Bash)
# Utilisation: ./deploy-log.sh [message]

MESSAGE=${1:-"Auto-deploy $(date '+%Y-%m-%d %H:%M:%S')"}
SSH_KEY="$HOME/.ssh/id_ed25519_nopass"
ALWAYSDATA_HOST="brf@ssh-brf.alwaysdata.net"
REMOTE_DIR="~/www"
LOG_FILE="deploy.log"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonction pour logger
log() {
    local TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$TIMESTAMP] $1" >> "$LOG_FILE"
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    local TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$TIMESTAMP] ❌ $1" >> "$LOG_FILE"
    echo -e "${RED}✗ $1${NC}"
}

log_section() {
    echo "" >> "$LOG_FILE"
    echo "===============================================" >> "$LOG_FILE"
    echo "  $1" >> "$LOG_FILE"
    echo "===============================================" >> "$LOG_FILE"
    echo -e "${BLUE}$1${NC}"
}

log_command() {
    echo "$ $1" >> "$LOG_FILE"
}

# Initialisation
clear
echo -e "${YELLOW}🚀 Déploiement automatisé avec logging${NC}\n"

# Créer/vider le fichier log
> "$LOG_FILE"

# Étape 1 : Commit local
log_section "[1/4] COMMIT LOCAL"

cd "$(dirname "$0")/www"

log_command "git add ."
git add . >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    log_error "git add échoué"
    exit 1
fi
log "git add réussi"
echo "" >> "$LOG_FILE"

log_command "git commit -m '$MESSAGE'"
git commit -m "$MESSAGE" >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    log_error "Commit échoué"
    exit 1
fi
log "Commit réussi"
echo "" >> "$LOG_FILE"

# Étape 2 : Push vers GitHub
log_section "[2/4] PUSH GITHUB"

log_command "git push origin main"
git push origin main >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    log_error "Push échoué"
    exit 1
fi
log "Push vers GitHub réussi"
echo "" >> "$LOG_FILE"

# Étape 3 : Pull sur Alwaysdata
log_section "[3/4] PULL ALWAYSDATA"

log_command "SSH vers Alwaysdata et git pull"
ssh -i "$SSH_KEY" -o IdentitiesOnly=yes "$ALWAYSDATA_HOST" << 'EOF' >> "$LOG_FILE" 2>&1
cd ~/www
git pull
EOF

if [ $? -ne 0 ]; then
    log_error "Pull sur Alwaysdata échoué"
    exit 1
fi
log "Pull sur Alwaysdata réussi"
echo "" >> "$LOG_FILE"

# Résumé final
log_section "✓ DÉPLOIEMENT COMPLET"
log "Tous les déploiements réussis"
echo "Heure fin : $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

echo -e "${GREEN}\n✓ Déploiement complet réussi !${NC}\n"
echo -e "${YELLOW}Consultez le fichier ${BLUE}$LOG_FILE${YELLOW} pour les détails.${NC}\n"

# Afficher un aperçu du log
echo -e "${BLUE}--- Résumé du log ---${NC}"
tail -n 15 "$LOG_FILE"
