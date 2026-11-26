#!/bin/bash
apt update -y
apt install -y openjdk-17-jdk git

# Swap de 1GB para que Maven no se quede sin memoria
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

cd /home/ubuntu
git clone https://github.com/Huginyo23/clubplan.git
cd clubplan/backend
chmod +x mvnw
./mvnw package -DskipTests -q
nohup java -jar target/clubplan-1.0.0.jar --server.port=80 > /home/ubuntu/app.log 2>&1 &
