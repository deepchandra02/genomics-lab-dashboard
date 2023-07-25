# an object of WSGI application
from flask import Flask, jsonify
import datetime
import psycopg2
from flask_cors import CORS
import json
import os

app = Flask(__name__)   # Flask constructor
CORS(app)
conn = psycopg2.connect(database="sidra",
                        host="localhost",
                        user="deepc",
                        password="mypassword",
                        port="5432")
conn.set_session(autocommit=True)
cursor = conn.cursor()

# A decorator used to tell the application
# which URL is associated function
@app.route('/')      
def hello():
    return 'HELLO'

# decorator to route URL
@app.route('/hello')

# binding to the function of route
def hello_world():	
    return 'hello world'

@app.route('/<name>')  
def hello_name(name):
   return 'Hello %s!' % name

@app.route('/type1/<date>')
def type1(date):
    if len(date) != 17:
        return "format should be 'yyyymmdd-yyyymmdd'"
    if date[8] != "-":
        return "format should be 'yyyymmdd-yyyymmdd'"
    
    dates = date.split("-")
    start = datetime.datetime.strptime(dates[0], '%Y%m%d').date()
    end = datetime.datetime.strptime(dates[1], '%Y%m%d').date()

    try:
        # Execute the SQL query
        cursor.execute("""
            SELECT
                TO_CHAR(loading_date, 'MM-DD-YYYY') AS "date",
                COUNT(DISTINCT samples.sample_id) AS "Samples",
                COUNT(DISTINCT samples.fc_id) AS "Flowcells",
                (SUM(COUNT(DISTINCT samples.sample_id)) OVER (ORDER BY loading_date))::integer AS "SamplesTotal",
                (SUM(COUNT(DISTINCT samples.fc_id)) OVER (ORDER BY loading_date))::integer AS "FlowcellsTotal"
            FROM
                flowcell
            INNER JOIN
                samples ON flowcell.fc_id = samples.fc_id
            WHERE
                loading_date >= '%s'::DATE AND loading_date <= '%s'::DATE
            GROUP BY
                loading_date
            ORDER BY
                loading_date;
            """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
    
                
        # Fetch the results from the cursor
        results = cursor.fetchall()

        columns = [desc[0] for desc in cursor.description]

        # Convert the results to a list of dictionaries
        rows = []
        for row in results:
            row_dict = {}
            for i, column in enumerate(columns):
                row_dict[column] = row[i]
            rows.append(row_dict)

        # Write the results to a JSON file
        with open('./front-end/src/newdata/data1.json', 'w') as f:
            json.dump(rows, f)
        return jsonify(rows)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/type2/<date>')
def type2(date):
    if len(date) != 17:
        return "format should be 'yyyymmdd-yyyymmdd'"
    if date[8] != "-":
        return "format should be 'yyyymmdd-yyyymmdd'"
    
    dates = date.split("-")
    start = datetime.datetime.strptime(dates[0], '%Y%m%d').date()
    end = datetime.datetime.strptime(dates[1], '%Y%m%d').date()

    try:
        # Execute the SQL query
        cursor.execute("""
                        SELECT fc_type, COUNT(*) as quantity
                        FROM flowcell
                        WHERE loading_date BETWEEN '%s' AND '%s'
                        GROUP BY fc_type
                        """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
                        
                
        # Fetch the results from the cursor
        results = cursor.fetchall()
        output = [{"type": row[0], "quantity": row[1]} for row in results]
        
        # Write the results to a JSON file
        with open('./front-end/src/newdata/data2.json', 'w') as f:
            json.dump(output, f)

        return jsonify(output)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500



    # return "Data is requested for dates from " + str(start) + " to " + str(end)




if __name__=='__main__':
    # app.debug = True
    # app.run()
    app.run(debug = True)
