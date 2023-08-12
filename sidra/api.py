# an object of WSGI application
from flask import Flask, jsonify, request
import datetime
import psycopg2
from flask_cors import CORS
import json
import os
from decimal import Decimal

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return super(JSONEncoder, self).default(obj)


app = Flask(__name__)   # Flask constructor
# app.json_encoder = JSONEncoder
CORS(app, resources={r"/*": {"origins": "*"}})
conn = psycopg2.connect(database="sidra",
                        host="localhost",
                        user="deepc",
                        password="mypassword",
                        port="5432")
conn.set_session(autocommit=True)
cursor = conn.cursor()



def parseDate(date):
    dates = date.split("-")
    start = datetime.datetime.strptime(dates[0], '%Y%m%d').date()
    end = datetime.datetime.strptime(dates[1], '%Y%m%d').date()
    return start, end


def sql(command):
    try:
        cursor.execute(command)
    except Exception as e:
        return e
    return cursor.fetchall()

# A decorator used to tell the application
# which URL is associated function
@app.route('/')      
def hello():
    return 'HELLO'


@app.route('/type0')
def type0():
    start = int(request.args.get('start', 0))
    size = int(request.args.get('size', 25))
    filters = json.loads(request.args.get('filters', '[]'))
    global_filter = request.args.get('globalFilter', '')
    sorting = json.loads(request.args.get('sorting', '[]'))

    # Build the WHERE clause for filtering
    where_clause = ""
    if global_filter:
        where_clause += f"WHERE (column1 LIKE '%{global_filter}%' OR column2 LIKE '%{global_filter}%' OR ...)" # Add appropriate columns
    for filter in filters:
        where_clause += f" AND {filter['column']} {filter['operator']} '{filter['value']}'"

    # Build the ORDER BY clause for sorting
    order_by_clause = ""
    if sorting:
        order_by_clause = "ORDER BY " + ", ".join([f"{sort['id']} {'DESC' if sort['desc'] else 'ASC'}" for sort in sorting])

    # Execute the SQL query with pagination, filtering, and sorting
    query = f"""
        SELECT *
        FROM samples AS s
        LEFT JOIN pools AS p ON s.pooling_id = p.pooling_id
        LEFT JOIN flowcell AS f ON s.fc_id = f.fc_id
        LEFT JOIN submissions AS sub ON s.submission_id = sub.submission_id
        LEFT JOIN pi_projects AS proj ON sub.project_id = proj.project_id
        LEFT JOIN i5 AS i5 ON s.i5_id = i5.i5_id
        LEFT JOIN i7 AS i7 ON s.i7_id = i7.i7_id
        LEFT JOIN sequencer AS seq ON f.sequencer_id = seq.sequencer_id
        {where_clause}
        {order_by_clause}
        LIMIT {size} OFFSET {start};
    """
    results = sql(query)

    # Get the column names from the cursor description
    columns = [desc[0] for desc in cursor.description]

    # Convert the results to a list of dictionaries
    output = []
    for row in results:
        row_dict = {}
        for i, column in enumerate(columns):
            if isinstance(row[i], datetime.date):
                row_dict[column] = row[i].isoformat()
            else:
                row_dict[column] = row[i]
        output.append(row_dict)
    
    # DEBUGGING< DON'T REMOVE
    # Write the results to a JSON file
    with open('./front-end/src/newdata/data0.json', 'w') as f:
        json.dump(output, f, cls=JSONEncoder)
    return jsonify(output)



@app.route('/type1/<date>')
def type1(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("SELECT\
                    TO_CHAR(demultiplex_date, 'YYYY-MM-DD'),\
                    COUNT(DISTINCT samples.sample_id),\
                    COUNT(DISTINCT samples.fc_id),\
                    SUM(COUNT(DISTINCT samples.sample_id)) OVER (ORDER BY demultiplex_date) ::integer,\
                    SUM(COUNT(DISTINCT samples.fc_id)) OVER (ORDER BY demultiplex_date) ::integer\
                FROM\
                    flowcell\
                INNER JOIN\
                    samples ON flowcell.fc_id = samples.fc_id\
                WHERE\
                    demultiplex_date >= '%s'::DATE AND demultiplex_date <= '%s'::DATE\
                GROUP BY\
                    demultiplex_date\
                ORDER BY\
                    demultiplex_date;"%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))

    
    output = [{"date": row[0], "Samples": row[1], "Flowcells":row[2], "SamplesTotal": row[3], "FlowcellsTotal": row[4]} for row in results]
    return jsonify(output)


@app.route('/type2a/<date>')
def type2a(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"
    
    results = sql("""
        SELECT pi, data_sample, COUNT(*) as quantity
        FROM samples
        INNER JOIN submissions ON samples.submission_id = submissions.submission_id
        INNER JOIN pi_projects ON submissions.project_id = pi_projects.project_id
        INNER JOIN flowcell ON samples.fc_id = flowcell.fc_id
        WHERE flowcell.loading_date BETWEEN '%s' AND '%s'
        GROUP BY pi, data_sample
        """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
        
    # Prepare the output
    output = []
    for row in results:
        pi, data_sample, quantity = row
        # find existing entry for the PI, if it exists
        pi_entry = next((entry for entry in output if entry["pi"] == pi), None)
        if pi_entry is None:
            # if no existing entry, create a new one
            pi_entry = {"pi": pi, "New": 0, "Top-up": 0, "Repeat": 0}
            output.append(pi_entry)
        # add the quantity to the appropriate field
        pi_entry[data_sample] = quantity
    
    return jsonify(output)

@app.route('/type2b/<date>')
def type2b(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("""
        SELECT pi, pi_projects.project_id, COUNT(*) as quantity
        FROM samples
        INNER JOIN submissions ON samples.submission_id = submissions.submission_id
        INNER JOIN pi_projects ON submissions.project_id = pi_projects.project_id
        INNER JOIN flowcell ON samples.fc_id = flowcell.fc_id
        WHERE flowcell.loading_date BETWEEN '%s' AND '%s'
        GROUP BY pi, pi_projects.project_id
        """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))

    # Prepare the output
    output = []
    for row in results:
        pi, project_id, quantity = row
        # find existing entry for the PI, if it exists
        pi_entry = next((entry for entry in output if entry["pi"] == pi), None)
        if pi_entry is None:
            # if no existing entry, create a new one
            pi_entry = {"pi": pi}
            output.append(pi_entry)
        # add the quantity to the appropriate field
        pi_entry[project_id] = quantity


    return jsonify(output)


@app.route('/type2c/<date>')
def type2c(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"
    
    results = sql("""
        SELECT pi, pi_projects.project_id, submissions.rg, COUNT(*) as quantity
        FROM samples
        INNER JOIN submissions ON samples.submission_id = submissions.submission_id
        INNER JOIN pi_projects ON submissions.project_id = pi_projects.project_id
        INNER JOIN flowcell ON samples.fc_id = flowcell.fc_id
        WHERE flowcell.loading_date BETWEEN '%s' AND '%s'
        GROUP BY pi, pi_projects.project_id, submissions.rg
        """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))

    output = [{"pi": row[0], "project": row[1], "sample_count":row[3], "genome": row[2]} for row in results]
    return jsonify(output)
    

@app.route('/type3/<date>')
def type3(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"
    results = sql("""
        SELECT fc_type, COUNT(*) as quantity
        FROM flowcell
        WHERE loading_date BETWEEN '%s' AND '%s'
        GROUP BY fc_type
        """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
                    
    output = [{"type": row[0], "quantity": row[1]} for row in results]
    return jsonify(output)

@app.route('/type4/<date>')
def type4(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("""
        SELECT s.srv, COUNT(*) as quantity
        FROM samples sm
        JOIN submissions s ON sm.submission_id = s.submission_id
        JOIN flowcell f ON sm.fc_id = f.fc_id
        WHERE f.loading_date BETWEEN '%s' AND '%s'
        GROUP BY s.srv
        """ % (start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
    
    output = [{"type": row[0], "quantity": row[1]} for row in results]
    return jsonify(output)

@app.route('/type5/<date>')
def type5(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"
    
    results = sql("""
        SELECT f.sequencer_id, COUNT(*) as quantity
        FROM samples sm
        JOIN flowcell f ON sm.fc_id = f.fc_id
        WHERE f.loading_date BETWEEN '%s' AND '%s'
        GROUP BY f.sequencer_id
        """ % (start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
            
    output = [{"type": row[0], "quantity": row[1]} for row in results]
    return jsonify(output)
    
@app.route('/type6/<date>')
def type6(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("""
        SELECT s.rg, COUNT(*) as quantity
        FROM samples sm
        JOIN submissions s ON sm.submission_id = s.submission_id
        JOIN flowcell f ON sm.fc_id = f.fc_id
        WHERE f.loading_date BETWEEN '%s' AND '%s'
        GROUP BY s.rg
        """ % (start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
    
    output = [{"type": row[0], "quantity": row[1]} for row in results]
    return jsonify(output)



if __name__=='__main__':
    # app.debug = True
    # app.run()
    app.run(debug = True)
