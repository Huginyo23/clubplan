#!/bin/bash
sudo yum install -y java-17-amazon-corretto git
cd /home/ec2-user
git clone https://github.com/Huginyo23/clubplan.git
cd clubplan/backend
chmod +x mvnw
./mvnw package -DskipTests -q
sudo nohup java -jar target/clubplan-1.0.0.jar --server.port=80 > /home/ec2-user/app.log 2>&1 &
