# Open Contracts App
An application that is built as a donation for Prishtina Municipality as part of Techstituion Program. The app consists of two core parts, the first one is about the administrative part in which Municipality Employees can manage the contracts, datasets, users and directorates. The contract's people in charge can also comment inside of contracts. The second part is the main purpose of this app, the transparency and accountability in which through visualization are displayed the trends of contracts in Prishtina through years and other rich information.


## Technologies used:
 * Server Side Plaform: **Node.js**
 * Backend Framework: **Express.js**
 * Database: **MongoDB**
 * Processing Data Language: **Python**
 * Web Service API: **REST**
 * ODM: **Mongoose**
 * JavaScript Superset: **TypeScript**
 * Frontend Framework: **Angular 5**
 * Responsive Interface: **Bootstrap 4**
 * Visualizations: **Highcharts**

## Getting Started
### Prerequisites
 * NodeJS
 * MongoDB 3.6
 * Git
 * Angular CLI
 * Pip (For processing data app)
 * Nginx (Only for Production)
 * PM2 (Only for Production)

## Installation of prerequisites
#### Install Node.js with package manager:
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

To compile and install native addons from npm you may also need to install build tools:
```
sudo apt-get install -y build-essential
```

#### Install Mongodb:
1. Import the public key used by the package management sytem:
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
```

2. Create a list file for MongoDB
Ubuntu 16.04:
```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
```

3. Reaload local package database
```
sudo apt-get update
```

4. Install the MongoDB packages
```
sudo apt-get install -y mongodb-org
```

5. Enable service to start on startup
```
systemctl enable mongod.service
```

#### Install git:
```
sudo apt-get install git
```
#### Install Angular CLI:
```
sudo npm install @angular/cli
```
#### Install Pip:
```
sudo apt-get install python-pip python-dev build-essential
sudo pip install --upgrade pip
sudo pip install --upgrade virtualenv 
```

## Setup Development Environment
Clone the project in your local machine.
```
git clone https://github.com/opendatakosovo/open-contracts-app/
```
### Setup Back-end
Change directory
```
cd open-contracts-app
```
Install back-end dependecies
```
npm install
```
Create user in mongodb
```
use opencontracts

db.createUser({
    user: "username",
    pwd: "password",
    roles: [{
        role: "readWrite" , db:"database-name"
    }]
});
```
Create a copy of **.env-template** file with name **.env**
```
cp .env-template .env
```
Set your values inside the **.env** file:
```
DB_HOST=127.0.0.1
DB_NAME=opencontracts
SERVER_PORT=3000
MAIL_USERNAME=open-contracts-platform@gmail.com
MAIL_PASSWORD=oc-platform
```
Seed the database with superadmin
```
node seeds/user.js
```
### Setup the processor and importer app
In order to seed the database with contracts data from 2010 until 2018, there is a need to process the data from CSV to JSON and import into DB.

Clone the processor app:
```
git clone https://github.com/opendatakosovo/prishtina-contracts-importer.git
```
Install the dependencies:
```
bash installer.sh
```
Seed the database with old contracts data 2010 - 2016:
```
bash run-old.sh
```
Seed the database with new contracts data 2017 - :
```
bash run.sh
```
Run the back-end side
```
node app.js
```
### Setup front-end
Change the directory:
```
cd client
```
Install dependencies:
```
npm install
```
Run the front-end app:
```
ng serve
```

## Production Environment - Not finished
Skip developement part and install the following tools if you are preparing for a production server deployment
#### Install Nginx:
1. Install with the apt packaging system
```
sudo apt-get update
sudo apt-get install nginx
```

2. Adjust the firewall
It is recommended that you enable the most restrictive profile that will still allow the traffic you've configured. We will only need to allow traffic on port 80.
```
sudo ufw allow 'Nginx HTTP'
```
You can verify the change by typing
```
sudo ufw status
```

3. Check your web server
At the end of the installation process Ubuntu starts Nginx. The web server should already be up and running.
We can check with the systemd init system to make sure the service is running by typing:
```
systemctl status nginx
```


#### Install PM2:
Now install PM2, which is a process manager for Node.js applications. PM2 provides an easy way to manage and daemonize applications (run them in the background as a service).
```
sudo npm install -g pm2
```

The startup subcommand generates and configures a startup script to launch PM2 and its managed processes on server boots:
```
pm2 startup systemd
```

#### Get the project:
Change directory to /var/www/
```
cd /var/www
```

Clone the project with git:
```
git clone https://github.com/opendatakosovo/open-contracts-app.git
```

Change directory in project directory
```
cd open-contracts-app
```

Install the node modules
```
npm install
```

Create a copy of **.env-template** file with name **.env**
```
cp .env-template .env
```
Set your values inside the **.env**:
```
DB_HOST=127.0.0.1
DB_NAME=database-name
SERVER_PORT=3000
MAIL_USERNAME=youremail
MAIL_PASSWORD=emailpassword
```

#### Set up nginx and run the server
Go back in project root folder
```
cd ..
```

Run seed for superadmin user
```
node seeds/user.js
```

Run the project with pm2
```
pm2 start app.js
```

Open the nginx default config file for editing:
```
sudo nano /etc/nginx/sites-available/default
```

Within the server block you should have an existing location / block. Replace the contents of that block with the following configuration. If your application is set to listen on a different port, update the highlighted portion to the correct port number.

```
. . .
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

```

This configures the server to respond to requests at its root. Assuming our server is available at example.com, accessing https://example.com/ via a web browser would send the request to app.js, listening on port 8080 at localhost.

Once you are done adding the location blocks for your applications, save and exit.

Configure the file upload limit
```
#Edit this file:
sudo nano /etc/nginx/nginx.conf

#Add this line inside the http block:
client_max_body_size 5M;

#Then restart Nginx
sudo service nginx restart
```

Make sure you didn't introduce any syntax errors by typing:
```
sudo nginx -t
```

Next, restart Nginx:
```
sudo systemctl restart nginx
```

## Authors
  * **[Arianit Hetemi](https://github.com/arianithetemi)** - Lead Software Developer
  * **[Dorron Zherka](https://github.com/dorronzherka)** - Software Developer
  * **[Kosovare Sahatqija](https://github.com/KosovareS)** - Quality Assurance
  * **[Leutrim Kosumi](https://github.com/leobaz)** - Software Developer
  * **[Florina Ahmeti](https://github.com/FlorinaAhmeti)** - Software Developer
