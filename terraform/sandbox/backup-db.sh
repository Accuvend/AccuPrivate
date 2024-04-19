# Create the backup file
aws s3 cp s3://accuvend-bucket-configuration/.env ./default.env
TIME=$(date --utc "+%Y%m%d_%H%M%SZ")

# Use the timestamp to construct a descriptive file name
BACKUP_FILE="accuvend_staging_db_${TIME}.pgdump" 
DATABASE_NAME=$(grep DB_DB_NAME ~/default.env | cut -d '=' -f2)  
DB_USERNAME=$(grep DB_USER_NAME ~/default.env | cut -d '=' -f2) 
DB_PASSWORD=$(grep DB_PASSWORD ~/default.env | cut -d '=' -f2)  
pg_dump postgresql://$DB_USERNAME:$DB_PASSWORD@127.0.0.1:5432/$DATABASE_NAME > $BACKUP_FILE 

# Second, copy file to AWS S3
S3_BUCKET=s3://accuvend-sand-box-db-backups
S3_TARGET=$S3_BUCKET/$BACKUP_FILE
echo "Copying $BACKUP_FILE to $S3_TARGET"
aws s3 cp $BACKUP_FILE $S3_TARGET

#verify the backup was uploaded correctly
echo "Backup completed for $DATABASE_NAME"
BACKUP_RESULT=$(aws s3 ls $S3_BUCKET | tail -n 1)
echo "Latest S3 backup: $BACKUP_RESULT"

#clean up and delete the local backup file
rm $BACKUP_FILE

sudo service postgresql restart