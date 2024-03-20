#!/bin/bash
set -e

# You can add another extensions here, don't forget to restart container
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    SELECT * FROM pg_extension;
EOSQL