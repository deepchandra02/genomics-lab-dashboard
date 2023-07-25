#!/bin/bash

# Clear the terminal screen
# /opt/homebrew/var/postgresql@12/postgresql.conf
clear

# psql -U postgres -c "ALTER USER postgres PASSWORD 'mypassword';"

# Drop and create the database using psql
psql -U hosting-db -d template1 -c 'DROP DATABASE IF EXISTS sidra;'
psql -U hosting-db -d template1 -c 'CREATE DATABASE sidra;'

# Run the createDB.py script
python3 createDB.py

# Run the insertDB.py script
python3 insertDB.py > "log.txt" 2>&1
