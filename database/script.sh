#!/bin/bash

# Clear the terminal screen
clear

psql -U postgres -c "ALTER USER deepc PASSWORD 'mypassword';"

# Drop and create the database using psql
psql -U deepc -d template1 -c 'DROP DATABASE IF EXISTS sidra;'
psql -U deepc -d template1 -c 'CREATE DATABASE sidra;'

# Run the createDB.py script
python3 createDB.py

# Run the insertDB.py script
python3 insertDB.py > "log.txt" 2>&1
