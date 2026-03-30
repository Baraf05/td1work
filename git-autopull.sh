ssh brf@ssh-brf.alwaysdata.net << 'EOF'
cd td1work

# Mise à jour du code
git pull origin main 
#git add .
#git commit -m "Auto pull "
#git push

if [ $? -eq 0 ]; then
  echo "Deploy success" | mail -s "Deploy OK" barannfall@gmail.com
else
  echo "Deploy failed" | mail -s "Deploy ERROR" barannfall@gmail.com
fi
EOF

# pour lancer 
# ./git-autopull.sh