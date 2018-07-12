sudo su
su jenkins
ssh jenkins@159.89.16.139<<EOF
 cd /var/www/open-contracts-app
 sudo su
 git pull
 npm --unsafe-perm --verbose install
 cd client
 npm --unsafe-perm --verbose install
 ng build --prod --extract-css=false
 pm2 restart app
 exit
EOF
