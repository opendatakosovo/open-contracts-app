sudo su
su jenkins
ssh jenkins@46.101.135.45 <<EOF
 cd /var/www/open-contracts-app
 sudo su
 git pull
 npm --unsafe-perm --verbose install
 cd angular-src
 npm --unsafe-perm --verbose install
 ng build
 pm2 restart app
 exit
EOF