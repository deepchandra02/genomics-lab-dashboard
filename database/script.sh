#!/bin/bash

# Clear the terminal screen
clear

# Drop and create the database using psql
sudo -u postgres psql -U postgres -c 'DROP DATABASE IF EXISTS sidra;'
sudo -u postgres psql -U postgres -c 'CREATE DATABASE sidra;'

# Run the createDB.py script
python3 createDB.py

# Run the insertDB.py script
python3 insertDB.py >> "log.txt" 2>&1
