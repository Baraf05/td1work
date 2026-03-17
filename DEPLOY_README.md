# 🚀 Scripts de Déploiement Automatisé - LocalHeb

Automatisez le cycle complet : **commit local → push GitHub → pull Alwaysdata**

---

## 📋 Scripts disponibles

### 1. PowerShell (Windows)

#### `deploy.ps1` - Version standard
```powershell
# Déployer avec message par défaut
.\deploy.ps1

# Déployer avec message personnalisé
.\deploy.ps1 -Message "Mon message de commit"

# Déployer avec clé SSH spécifique
.\deploy.ps1 -SshKey "C:\Users\...\id_ed25519_nopass"
```

#### `deploy-heredoc.ps1` - Version avec heredoc (EOF)
```powershell
# Méthode avec EOF comme le prof l'a suggéré
.\deploy-heredoc.ps1
```

### 2. Bash (Linux/Mac)

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Exécuter avec message par défaut
./deploy.sh

# Exécuter avec message personnalisé
./deploy.sh "Mise à jour du 14 février"
```

---

## ⚙️ Configuration requise

- ✅ **Clé SSH sans passphrase** : `~/.ssh/id_ed25519_nopass`
- ✅ **Authentification GitHub SSH** : Clé publique ajoutée sur GitHub
- ✅ **Accès Alwaysdata** : Authentification SSH configurée
- ✅ **Dépôt local** : Git configuré avec `origin` pointant vers GitHub

---

## 🔄 Flux d'exécution

```
┌─────────────────────────────────────────┐
│ 1️⃣  Modification locale (code)         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│ 2️⃣  ./deploy.ps1 ou ./deploy.sh        │
│    • git add .                          │
│    • git commit -m "message"            │
│    • git push origin main               │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│ 3️⃣  SSH → Alwaysdata                   │
│    • cd ~/www                           │
│    • git pull                           │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│ ✓ Déploiement complet                   │
│   (Local + GitHub + Alwaysdata sync)    │
└─────────────────────────────────────────┘
```

---

## 📝 Exemple d'utilisation

```bash
# Vous modifiez index.php localement
# Vous lancez le script :

$ ./deploy.sh "Fix: mise à jour du titre"

# Output:
# 🚀 Déploiement automatisé - LocalHeb
# 📝 [1/4] Commit local...
# ✓ Commit réussi
# 📤 [2/4] Push vers GitHub...
# ✓ Push réussi
# 🔄 [3/4] Pull sur Alwaysdata...
# ✓ Pull réussi
# ✓ Déploiement complet réussi !
```

---

## 🔧 Dépannage

### Erreur : "Host key verification failed"
```bash
# Ajouter GitHub aux known_hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

### Erreur : "Permission denied"
```bash
# Vérifier que la clé SSH est correctement configurée
ssh -i ~/.ssh/id_ed25519_nopass brf@ssh-brf.alwaysdata.net "whoami"
```

### Erreur : "git pull" échoue sur Alwaysdata
```bash
# Vérifier que le dépôt est bien cloné
ssh brf@ssh-brf.alwaysdata.net "ls -la ~/www/.git"
```

---

## 📚 Ressources

- [Documentation GitHub SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Alwaysdata - Configuration SSH](https://help.alwaysdata.com/en/advanced/ssh)
- [Git Workflow](https://git-scm.com/book/en/v2)

---

**Créé le** : 14 février 2026  
**Auteur** : LocalHeb Deploy System
