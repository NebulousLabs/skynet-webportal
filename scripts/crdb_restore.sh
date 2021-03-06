#!/bin/bash

BACKUP=$1
if [[ $BACKUP == "" ]]; then
  echo "No backup name given. It should look like '2020-01-29'."
  exit 1
fi

# Get current working directory (pwd doesn't cut it)
cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
# Set the environment:
set -o allexport
source $cwd/../.env
set +o allexport
# Check for AWS credentials:
if [[ $AWS_ACCESS_KEY_ID == "" || $AWS_SECRET_ACCESS_KEY == "" ]]; then
  echo "Missing AWS credentials!"
  exit 1
fi
# Restore the backup:
docker exec cockroach \
  cockroach sql \
  --host cockroach:26257 \
  --certs-dir=/certs \
  --execute="RESTORE DATABASE defaultdb FROM 's3://skynet-crdb-backups/backups/cockroach/$DT?AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID&AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY';"
