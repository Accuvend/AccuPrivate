#!/bin/bash

# Step 1: Install aws-cli
sudo apt-get update
sudo apt-get install -y awscli
# curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
# unzip awscliv2.zip
# sudo cp 
# sudo ./aws/install

# Step 2: Install PostgreSQL and configure using .env
sudo apt-get install -y postgresql postgresql-client-common postgresql-contrib


# 2.1 update postgresql.conf 
sudo sh -c "echo \"listen_addresses = '*'\" >> /etc/postgresql/14/main/postgresql.conf"

# 2.2 update pg_hba.conf
sudo sh -c 'echo "host all all 0.0.0.0/0 trust" >> /etc/postgresql/14/main/pg_hba.conf'
sudo sh -c 'echo "host    all             all             0.0.0.0/0            md5" >> /etc/postgresql/14/main/pg_hba.conf'


#2.3 restart server 
sudo service postgresql restart

# Step 3: Change user to postgres user 
sudo su - postgres

# Step 4: Pull .env file from S3 bucket to the home directory
aws s3 cp s3://accuvend-bucket-configuration/.env ~/default.env


# Read database credentials from .env file
DB_USERNAME=$(grep DB_USER_NAME ~/default.env | cut -d '=' -f2)
DB_PASSWORD=$(grep DB_PASSWORD ~/default.env | cut -d '=' -f2) 
DB_NAME=$(grep DB_DB_NAME ~/default.env | cut -d '=' -f2)

# Create PostgreSQL user and database
psql -c "CREATE USER $DB_USERNAME WITH PASSWORD '$DB_PASSWORD';"
psql -v ON_ERROR_STOP=1  <<-EOSQL
    CREATE DATABASE "$DB_NAME"
    WITH OWNER = "$DB_USERNAME";
EOSQL


# # Restart PostgreSQL for changes to take effect

echo "Installation and configuration completed successfully."
