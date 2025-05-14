# 🐝 Apiary Data Visualization Application

## Project Summary

This project involves building a full-stack data pipeline and dashboard for RIT's Apiary dataset. 

## Tasks accomplished 

Imported CSVs into a MongoDB time-series model, developed a Flask API for readings and aggregations, and created a React frontend to visualize raw, daily, monthly, and min/max hive data, organized by hive and location. Handled missing humidity data gracefully without crashing aggregation queries.

## Screenshots

Screenshots have been attached in the Screenshots folder


## Steps to Run the Application

-   To run BE:

    Install dependencies:
    cd backend

    Run the following commands in bash/ Terminal
        mmongod --dbpath /var/lib/mongodb --bind_ip 127.0.0.1 --port 27017
        python db_import.py
        mongosh < build_project_db.js

    pip install -r requirements.txt

    Start Flask server:
        python app.py

-   Frontend:
        Install dependencies in frontend folder:
        npm install

        Run the server:
        cd frontend        
        npm start