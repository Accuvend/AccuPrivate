#Variables 
variable "region" {
  description = "The AWS region"
  default     = "eu-west-2"
}

variable "access_key" {
  description = "The AWS access key"
  default     = ""
}

variable "secret_key" {
  description = "The AWS secret key"
  default     = ""
}

variable "subnet_1" {
  description = "The second subnet CIDR block"
  default     = "10.0.1.0/24"
}

variable "subnet_2" {
  description = "The second subnet CIDR block"
  default     = "10.0.1.0/24"
}

variable "subnet_3" {
  description = "The third subnet CIDR block"
  default     = "10.0.2.0/24"
}

variable "accountId" {
  description = "The AWS account ID"
  default     = "*******"
}

variable "image_id" {
  description = "The ID of the AMI to use for the instance"
  default     = ""
}

variable "instance_keypair" {
  description = "The name of the key pair for the EC2 instance"
  default     = ""
}

variable "instance_type" {
  description = "The EC2 instance type"
  default     = "t2.micro"
}

variable "kafka_instance_type" {
  description = "The Kafka instance type"
  default     = ""
}


# variable "db_password" {
#   description = "The password for the database"
#   default     = ""
# }

# variable "db_user_name" {
#   description = "The username for the database"
#   default     = ""
# }

# variable "db_instance_type" {
#   description = "The instance type for the database"
#   default     = ""
# }

# variable "db_db_name" {
#   description = "The name of the database"
#   default     = ""
# }


terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = "eu-west-2"
  access_key = var.access_key
  secret_key = var.secret_key
}

resource "aws_vpc" "sand_box_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "sanbox vpc"
  }
}

resource "aws_subnet" "sandbox_public_subnet_1" {
  vpc_id            = aws_vpc.sand_box_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-west-2a"

  tags = {
    Name = "Sand Box Public Subnet 1"
  }
}

resource "aws_subnet" "sandbox_public_subnet_2" {
  vpc_id            = aws_vpc.sand_box_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-west-2b"

  tags = {
    Name = "Sand Box Public Subnet 2"
  }
}

resource "aws_subnet" "sandbox_public_subnet_3" {
  vpc_id            = aws_vpc.sand_box_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "eu-west-2c"

  tags = {
    Name = "Sand Box Public Subnet 3"
  }
}

resource "aws_subnet" "sandbox_private_subnet_2" {
  vpc_id            = aws_vpc.sand_box_vpc.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "eu-west-2b"

  tags = {
    Name = "Sand Box Private Subnet 2"
  }
}

resource "aws_subnet" "sandbox_private_subnet_1" {
  vpc_id            = aws_vpc.sand_box_vpc.id
  cidr_block        = "10.0.5.0/24"
  availability_zone = "eu-west-2a"

  tags = {
    Name = "Sand Box Private Subnet 1"
  }
}

resource "aws_internet_gateway" "sandbox_internetgateway" {
  vpc_id = aws_vpc.sand_box_vpc.id

  tags = {
    Name = "Sand Box Gateway"
  }
}

resource "aws_route_table" "sandbox_public_route_table" {
  vpc_id = aws_vpc.sand_box_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.sandbox_internetgateway.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.sandbox_internetgateway.id
  }

  tags = {
    Name = "Sand Box Public Route Table"
  }
}

resource "aws_route_table" "sandbox_public_route_table2" {
  vpc_id = aws_vpc.sand_box_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.sandbox_internetgateway.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.sandbox_internetgateway.id
  }

  tags = {
    Name = "Sand Box Public Route Table"
  }
}

resource "aws_route_table" "sandbox_public_route_table3" {
  vpc_id = aws_vpc.sand_box_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.sandbox_internetgateway.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.sandbox_internetgateway.id
  }

  tags = {
    Name = "Sand Box Public Route Table"
  }
}



resource "aws_route_table_association" "sandbox_route_public_route_1_table_assoc" {
  subnet_id      = aws_subnet.sandbox_public_subnet_1.id
  route_table_id = aws_route_table.sandbox_public_route_table.id
}

resource "aws_route_table_association" "sandbox_route_public_route_2_table_assoc" {
  subnet_id      = aws_subnet.sandbox_public_subnet_2.id
  route_table_id = aws_route_table.sandbox_public_route_table2.id
}

resource "aws_route_table_association" "sandbox_route_public_route_3_table_assoc" {
  subnet_id      = aws_subnet.sandbox_public_subnet_3.id
  route_table_id = aws_route_table.sandbox_public_route_table3.id
}


resource "aws_security_group" "sandbox_db_security_group" {
  name   = "Postgresql and SSH"
  vpc_id = aws_vpc.sand_box_vpc.id


  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "sandbox_loadbalancer_security_group" {
  name   = "Load banalancer"
  vpc_id = aws_vpc.sand_box_vpc.id


  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  egress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    
  }

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  
}

resource "aws_security_group" "sandbox_core_engine_security_group" {
  name   = "Core Engine SG"
  vpc_id = aws_vpc.sand_box_vpc.id


  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}


# NAT GAte way and private route tables 

resource "aws_eip" "natgateW1_eip" {
  domain = "vpc"
  tags ={
    Name: "Sandbox natgateway elastic ip 1"
  }
}

resource "aws_nat_gateway" "sandbox_natgateway1" {
  allocation_id = aws_eip.natgateW1_eip.allocation_id
  subnet_id = aws_subnet.sandbox_public_subnet_1.id
  tags ={
    Name: "sandbox-Natgateway-1"
  }

  depends_on = [ aws_internet_gateway.sandbox_internetgateway ]
}

# Private route tables
resource "aws_route_table" "sandbox_private_route_table1" {
  vpc_id = aws_vpc.sand_box_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
   nat_gateway_id = aws_nat_gateway.sandbox_natgateway1.id
  }

  # route {
  #   ipv6_cidr_block = "::/0"
  #   nat_gateway_id     = aws_nat_gateway.production_natgateway1.id
  # }

  # route {
  #   cidr_block = "10.0.0.0/16"
  #   gateway_id = "local"
  # }

  # route {
  #   ipv6_cidr_block = "2001:db8:1234:1a00::/56"
  #   gateway_id = "local"
  # }

 

  tags = {
    Name = "Sandbox Private Route Table 1"
  }
}

# Private route assocation tables 

resource "aws_route_table_association" "production_route_private_route_1_table_assoc" {
  subnet_id      = aws_subnet.sandbox_private_subnet_1.id
  route_table_id = aws_route_table.sandbox_private_route_table1.id
}

# resource "aws_security_group" "sandbox_kafka_security_group" {
#   name   = "Kafka Sandbox SG"
#   vpc_id = aws_vpc.sand_box_vpc.id


#   ingress {
#     from_port   = 9092
#     to_port     = 9092
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 29092
#     to_port     = 29092
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 9999
#     to_port     = 9999
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

  

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = -1
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }


resource "aws_instance" "sandbox_db_instance" {
  ami           = var.image_id
  instance_type = var.instance_type
  key_name      = var.instance_keypair

  subnet_id                   = aws_subnet.sandbox_private_subnet_1.id
  vpc_security_group_ids      = [aws_security_group.sandbox_db_security_group.id]
  associate_public_ip_address = true
  iam_instance_profile = aws_iam_instance_profile.sandbox_ec2_profile.name

  user_data = <<-EOF
  #!/bin/bash

  # Step 1: Install aws-cli
  sudo apt-get update
  sudo apt-get install -y awscli
  # curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  # unzip awscliv2.zip
  # sudo cp 
  # sudo ./aws/install

  # Step 2: Install PostgreSQL and configure using .env
  sudo apt-get install -y postgresql-14 postgresql-client-common postgresql-contrib


  # 2.1 update postgresql.conf 
  sudo sh -c "echo \"listen_addresses = '*'\" >> /etc/postgresql/14/main/postgresql.conf"

  # 2.2 update pg_hba.conf
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
  psql -c "CREATE DATABASE $DB_NAME WITH OWNER = '$DB_USERNAME'";
  # psql -v ON_ERROR_STOP=1  
  # <<-EOSQL
  #     CREATE DATABASE "$DB_NAME"
  #     WITH OWNER = "$DB_USERNAME";
  # EOSQL
  

  # # Restart PostgreSQL for changes to take effect

  #Create Backup
  #download backup automation file that saves to s3 bucket
  aws s3 cp s3://accuvend-sand-box-db-backups/backup-db.sh ./backup-db.sh
  chmod u+x backup-db.sh

  # create a cronjob for backups 
  echo "0 2 * * * ~/backup-db.sh &>> ~/backup-db.log" | crontab -
  # echo "0 2 * * * ~/backup-db.sh" | crontab -


  echo "Installation and configuration completed successfully."

  #Creating a new-relic user in the sandbox postgres

  NEWRELIC_DB_PASSWORD=$(grep NEWRELIC_DB_PASSWORD ~/default.env | cut -d '=' -f2) 
  NEWRELIC_DB_USERNAME=$(grep NEWRELIC_DB_USER_NAME ~/default.env | cut -d '=' -f2)

  psql -c "CREATE USER $NEWRELIC_DB_USERNAME WITH PASSWORD '$NEWRELIC_DB_PASSWORD';"
  psql -c "Granting the user SELECT privileges GRANT SELECT ON pg_stat_database, pg_stat_database_conflicts, pg_stat_bgwriter TO $NEWRELIC_DB_USERNAME;"
  # psql -v ON_ERROR_STOP=1  <<-EOSQL 
  #   Granting the user SELECT privileges 
  #   GRANT SELECT ON pg_stat_database, pg_stat_database_conflicts, pg_stat_bgwriter TO $NEWRELIC_DB_USERNAME;
  # EOSQL

  # Install new_relic postgresql 
  sudo apt-get install nri-postgresql -y

  cd 

  #pull new relic install from s3 
  # completed 
  cd /etc/newrelic-infra/integrations.d

  sudo aws s3 cp  s3://accuvend-bucket-configuration/new_relic_sandbox_db_config/postgresql-config.yml ./postgresql-config.yml

  sudo /usr/bin/newrelic-infra -dry_run -integration_config_path /etc/newrelic-infra/integrations.d/postgresql-config.yml | grep -wo "Integration health check finished with success"

  # setting up logs
  cd /etc/newrelic-infra/logging.d/
  sudo aws s3 cp  s3://accuvend-bucket-configuration/new_relic_sandbox_db_config/postgresql-log.yml ./postgresql-log.yml

  EOF

  tags = {
    "Name" : "Sand Box DB Instance"
  }
}

#load balancer

resource "aws_lb_target_group" "sandbox_target_group_http" {
    name     = "sandbox-target-group-http"
    port     = 80
    protocol = "HTTP"
    vpc_id   = aws_vpc.sand_box_vpc.id
    health_check {
      interval = 30
      healthy_threshold = 2
      unhealthy_threshold = 5
      path = "/"
      timeout = 8
    }
}

resource "aws_lb" "sandbox_load_balancer" {
  name               = "sandbox-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.sandbox_loadbalancer_security_group.id]
  subnets            = [aws_subnet.sandbox_public_subnet_1.id, aws_subnet.sandbox_public_subnet_2.id]

  idle_timeout = 3600
  # enable_deletion_protection = true

  # access_logs {
  #   bucket  = aws_s3_bucket.lb_logs.id
  #   prefix  = "sandbox-lb"
  #   enabled = true
  # }

  tags = {
    Environment = "sandbox"
    name = "sandbox_application_load_balancer"
  }
}

resource "aws_lb_target_group_attachment" "sandbox_load_balancer_attachment" {
  target_group_arn = aws_lb_target_group.sandbox_target_group_http.arn
  target_id = aws_instance.sandbox_core_engine_instance.id
  port = 80
}

resource "aws_lb_listener" "sandbox_application_load_balancer_listner_http" {
  load_balancer_arn = aws_lb.sandbox_load_balancer.arn
  port              = "80"
  protocol          = "HTTP"  

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.sandbox_target_group_http.arn
  }
}

# Set up HTTPS Listener

resource "aws_lb_listener" "sandbox_application_load_balancer_listner_https" {
  load_balancer_arn = aws_lb.sandbox_load_balancer.arn
  port              = "443"
  protocol          = "HTTPS"  

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.sandbox_target_group_http.arn
  }
}


# core engine

resource "aws_instance" "sandbox_core_engine_instance" {
  ami           = var.image_id
  instance_type = var.instance_type
  key_name      = var.instance_keypair

  subnet_id                   = aws_subnet.sandbox_public_subnet_1.id
  vpc_security_group_ids      = [aws_security_group.sandbox_core_engine_security_group.id]
  associate_public_ip_address = true
  iam_instance_profile = aws_iam_instance_profile.sandbox_ec2_profile.name

  user_data = <<-EOF
  #!/bin/bash

  # Step 1: Install aws-cli
  sudo apt-get update
  sudo apt-get -y zip
  sudo apt-get install -y awscli
  # curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  # unzip awscliv2.zip
  # sudo cp 
  # sudo ./aws/install

  # Step 2: Install PostgreSQL and configure using .env
  sudo apt-get install -y postgresql-client postgresql-client-common postgresql-contrib

  # step install ngnix 
  sudo apt-get -y install nginx
  sudo systemctl enable nginx
  sudo systemctl start nginx

  #install node and pm2
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
  sudo apt-get install -y nodejs
  sudo apt-get -y install build-essential
  sudo npm install -g pm2

  #Install Kafka
  sudo apt -y install openjdk-11-jdk
  wget https://archive.apache.org/dist/kafka/2.6.2/kafka_2.12-2.6.2.tgz

  # Use the kafka file
  tar -xzf kafka_2.12-2.6.2.tgz

  sudo sh -c 'echo "security.protocol=SASL_SSL" >> ./kafka_2.12-2.6.2/bin/client.properties'
  sudo sh -c 'echo "sasl.mechanism=AWS_MSK_IAM" >> ./kafka_2.12-2.6.2/bin/client.properties'
  sudo sh -c 'echo "sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;" >> ./kafka_2.12-2.6.2/bin/client.properties'
  sudo sh -c 'echo "sasl.client.callback.handler.class=software.amazon.msk.auth.iam.IAMClientCallbackHandler" >> ./kafka_2.12-2.6.2/bin/client.properties'

  # download jar file
  sudo wget https://github.com/aws/aws-msk-iam-auth/releases/download/v2.0.3/aws-msk-iam-auth-2.0.3-all.jar
  export CLASSPATH=/home/ubuntu/aws-msk-iam-auth-2.0.3-all.jar

  # download build 
  aws s3 cp s3://staging-bucket-deployment/dist.zip dist.zip
  unzip dist.zip
  # cd 
  cd dist

  # Get ENV file
  aws s3 cp s3://accuvend-bucket-configuration/.env ./.env

  #GET DATABASE CREDENTINALS
  DB_USERNAME=$(grep DB_USER_NAME ./.env | cut -d '=' -f2) &&\
  DB_PASSWORD=$(grep DB_PASSWORD ./.env | cut -d '=' -f2) &&\
  DB_NAME=$(grep DB_DB_NAME ./.env | cut -d '=' -f2) &&\
  DB_HOST=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=Sand Box DB Instance" --query "Reservations[].Instances[].[PublicIpAddress]" --output text)

  echo "DB_URL=postgres://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME" >> .env

  #install depencendies in dist folder
  npm install

  #Set up pm2 on server restart
  sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
  pm2 start server.js --time

  # have to update sudo nano /etc/nginx/sites-available/default
  sudo systemctl restart nginx

  # NEW RELIC INTEGRATION
  
  EOF

  

  tags = {
    "Name" : "Sand Box Core Instance"
  }
}


#S3 Policy to update Deployment 
resource "aws_iam_policy" "sandbox_iam_S3_policy" {
 
  name = "sandbox-iam-s3-policy"
  policy = jsonencode(
  {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "s3:GetObject",
          "s3:ListBucket",
          "s3:*Object"
        ],
        Resource: [
          "arn:aws:s3:::*/*",
          "arn:aws:s3:::*"
        ]
      }
    ]
  })
  
  
}


#IAM Policy for Kafka 
resource "aws_iam_policy" "sandbox_iam_kafka_policy" {
  name = "sandbox-iam-kafka-policy"
  policy = jsonencode(
  {
    Version: "2012-10-17",
    Statement: [
        {
            Effect: "Allow",
            Action: [
                "kafka-cluster:Connect",
                "kafka-cluster:AlterCluster",
                "kafka-cluster:DescribeCluster"
            ],
            # Resource: [
            #     "arn:aws:kafka:${var.region}:${var.accountId}:cluster/${aws_msk_cluster.sandbox_aws_managed_kafka.cluster_name}/*"
            # ]
            Resource: "*"
        },
        {
            Effect: "Allow",
            Action: [
                "kafka-cluster:*Topic*",
                "kafka-cluster:WriteData",
                "kafka-cluster:ReadData"
            ],
            # Resource: [
            #     "arn:aws:kafka:${var.region}:${var.accountId}:topic/${aws_msk_cluster.sandbox_aws_managed_kafka.cluster_name}/*"
            # ]
            Resource: "*"
        },
        {
            Effect: "Allow",
            Action: [
                "kafka-cluster:AlterGroup",
                "kafka-cluster:DescribeGroup"
            ],
            # Resource: [
            #     "arn:aws:kafka::${var.region}:${var.accountId}:group/${aws_msk_cluster.sandbox_aws_managed_kafka.cluster_name}/*"
            # ]
            Resource: "*"
        }
    ]
  })
  
  
  
}

# IAM Role for Kafka and s3

resource "aws_iam_role" "sandbox_iam_kafka_s3_role" {
  name = "sandbox_iam_kafka_s3_role"
  assume_role_policy = jsonencode({
      Version : "2012-10-17",
      Statement : [
        {
          Effect : "Allow",
          Principal : {
            Service : "ec2.amazonaws.com"
          },
          Action : "sts:AssumeRole"
        }
      ]
    })
      
}


#IAM S3 Role Policy attachment
resource "aws_iam_role_policy_attachment" "sandbox_role_S3_policy_attachment" {
  role       = aws_iam_role.sandbox_iam_kafka_s3_role.name
  policy_arn = aws_iam_policy.sandbox_iam_S3_policy.arn
}

#IAM KAFKA Role Policy attachment
resource "aws_iam_role_policy_attachment" "sandbox_role_kafka_policy_attachment" {
  role       = aws_iam_role.sandbox_iam_kafka_s3_role.name
  policy_arn = aws_iam_policy.sandbox_iam_kafka_policy.arn
}

#EC2 Update Creating the EC2 profile

resource "aws_iam_instance_profile" "sandbox_ec2_profile" {
  name = "sandbox-ec2-profile"
  role = aws_iam_role.sandbox_iam_kafka_s3_role.name
}


#creating Managed kafka 

# resource "aws_msk_cluster" "sandbox_aws_managed_kafka" {
#   cluster_name = "sandbox-aws-managed-kafka-3"
#   kafka_version = "3.5.1"
#   number_of_broker_nodes = 3
#   depends_on = [ aws_subnet.sandbox_public_subnet_3 ]


#   broker_node_group_info {
#     instance_type = var.kafka_instance_type
#     client_subnets = [
#       aws_subnet.sandbox_public_subnet_1.id,
#       aws_subnet.sandbox_public_subnet_2.id,
#       aws_subnet.sandbox_public_subnet_3.id
#     ]
#      storage_info {
#       ebs_storage_info {
#         volume_size = 10
#       }
#     }
#     security_groups = [aws_security_group.sandbox_kafka_security_group.id]
#     # connectivity_info {
#     #   # public_access {
#     #   #   type = "SERVICE_PROVIDED_EIPS"
#     #   # }
#     #   # vpc_connectivity {
#     #   #   client_authentication {
#     #   #     sasl {
#     #   #       iam = true
#     #   #     }
#     #   #   }
#     #   # }
#     # }
#   }



# }


