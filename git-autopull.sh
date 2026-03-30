ssh tibuleac_den@ssh-tibuleac.alwaysdata.net << 'EOF'
cd Workflow 

# Mise Ã jour du code
git pull origin main >> deploy.log 2>&1
echo >> deploy.log
{git add .
#git commit -m "Auto pull "
#git push

if [ $? -eq 0 ]; then
  echo "Deploy success" | mail -s "Deploy OK" tibuleacdenis4@gmail.com
else
  echo "Deploy failed" | mail -s "Deploy ERROR" tibuleacdenis4@gmail.com
fi
EOF

# pour lancer 
# ./git-autopull.sh