# an object of WSGI application
from flask import Flask, jsonify, request
import datetime
import psycopg2
import json
import os
app = Flask(__name__)   # Flask constructor

conn = psycopg2.connect(database="sidra",
                        host="localhost",
                        user="postgres",
                        password="mypassword",
                        port="5432")
conn.set_session(autocommit=True)
cursor = conn.cursor()


def sql(command):
    try:
        cursor.execute(command)
    except Exception as e:
        return e
    return cursor.fetchall()

def parseDate(date):
    dates = date.split("-")
    start = datetime.datetime.strptime(dates[0], '%Y%m%d').date()
    end = datetime.datetime.strptime(dates[1], '%Y%m%d').date()
    return start, end

aliases = {
    'sample_id': 's',
    'pooling_id': 'p',
    'fc_id': 'f',
    'submission_id': 'sub',
    'project_id': 'proj',
    'i5_id': 'i5',
    'i7_id': 'i7',
    'sequencer_id': 'seq'
}

def resolve(column):
    if column[-3:] == "_id":
        return aliases[column] + "." + column
    return column

@app.route('./Pregress/refresh')
def refresh():
    paths_json = open("./paths.json", 'r')
    paths = json.load(paths_json)
    paths_json.close()
    dir = paths["Staging"]

    results = sql("SELECT sample_id, error FROM samples WHERE error != '_'")
    if isinstance(results, list):
        count = 0
        for row in results:
            path = dir + row[1]
            if os.path.isfile(path) and os.pathgetsize(path) == 0:
                sql("UPDATE samples SET error = '_' WHERE sample_id = '%s'"%(row[0],))
                count += 1
        
        if count == 0:
            return "No new error file resolved"
        return str(count) + " error file(s) resolved"
    else:
        return "refresh failed for exception " + results

@app.route('./Progress/release/',methods=['PUT'])
def release():
    data = request.data
    failed = dict()
    for element in data:
        sample_id, fc_id = element
        result = sql("UPDATE samples SET release_date = '%s' WHERE sample_id = '%s' AND fc_id = '%s';"%(datetime.datetime.today().date(), sample_id, fc_id))
        if result != []:
            failed[element] = result
    
    if not failed:
        return "Released successfully"
    
    s = ""
    for key in failed:
        s += "Release failed for " + key + " for the exception " + failed[key] + "\n"

    return s


@app.route('/type0')
def type0():
    start = int(request.args.get('start', 0))
    size = int(request.args.get('size', 25))
    filters = json.loads(request.args.get('filters', '[]'))
    # global_filter = request.args.get('globalFilter', '')
    sorting = json.loads(request.args.get('sorting', '[]'))
    
    print(filters)

    # Multiple column sorting isn't available
    assert(len(sorting) < 2)

    # Hardcoding to resolve ambiguity
    # if len(sorting) == 1: 
    #     if sorting[0]["id"] == "submission_id":
    #         sorting[0]["id"] = "sub.submission_id"
    #     if sorting[0]["id"] == "submission_id":
    #         sorting[0]["id"] = "sub.submission_id"
        
    # Build the WHERE clause for filtering
    where_clause = "WHERE"
    # if global_filter:
    #     where_clause += f"WHERE (column1 LIKE '%{global_filter}%' OR column2 LIKE '%{global_filter}%' OR ...)" # Add appropriate columns
    for filter in filters:
        value = filter['value']

        if isinstance(value, str):
            where_clause += f" {resolve(filter['id'])} = '{value}'"
        elif isinstance(value, list):
            where_clause += f" {resolve(filter['id'])} IN {tuple(value)}"
        else:
            return "value type inappropriate in filter"
        where_clause += " AND "

    where_clause = where_clause[:-5]

    print(where_clause)

    # where_clause = "WHERE f.fc_id = 'dummy search'"

    # Build the ORDER BY clause for sorting
    order_by_clause = ""
    if sorting:
        order_by_clause = "ORDER BY " + ", ".join([f"{resolve(sort['id'])} {'DESC' if sort['desc'] else 'ASC'}" for sort in sorting])

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

    print(query)
    print(results)

    # Get the column names from the cursor description
    # return cursor.description
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
    # with open('./front-end/src/newdata/data0.json', 'w') as f:
    #     json.dump(output, f, cls=JSONEncoder)
    return jsonify(output)



@app.route('/data1/<date>')
def data1(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    try:
        # Execute the SQL query
        cursor.execute("SELECT\
                            TO_CHAR(demultiplex_date, 'MM-DD-YYYY') AS date,\
                            COUNT(DISTINCT samples.sample_id) AS Samples,\
                            COUNT(DISTINCT samples.fc_id) AS Flowcells,\
                            SUM(COUNT(DISTINCT samples.sample_id)) OVER (ORDER BY demultiplex_date) AS SamplesTotal,\
                            SUM(COUNT(DISTINCT samples.fc_id)) OVER (ORDER BY demultiplex_date) AS FlowcellsTotal\
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
        
        return jsonify(rows)
    
    except Exception as e:
        return str(e)


@app.route('/data2a/<date>')
def data2a(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    try:
        cursor.execute("""
                        SELECT 
                            pi,
                            SUM(CASE WHEN data_sample = 'New' THEN 1 ELSE 0 END) AS "New",
                            SUM(CASE WHEN data_sample = 'Top-up' THEN 1 ELSE 0 END) AS "Top up",
                            SUM(CASE WHEN data_sample = 'Repeat' THEN 1 ELSE 0 END) AS "Repeat"
                        FROM
                            pi_projects p
                        LEFT JOIN
                            submissions s ON p.project_id = s.project_id
                        LEFT JOIN
                            flowcell f ON s.submission_id = f.fc_id
                        LEFT JOIN
                            samples sa ON f.fc_id = sa.fc_id
                        GROUP BY
                            pi;
                    """)
    except Exception as e:
        return str(e)

    # Fetch twhe results from the cursor
    results = cursor.fetchall()
    output = [{"type": row[0], "quantity": row[1]} for row in results]
    
    return jsonify(output)
        

@app.route('/data3/<date>')
def data3(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    try:
        # Execute the SQL query
        cursor.execute("""
                        SELECT fc_type, COUNT(*) as quantity
                        FROM flowcell
                        WHERE demultiplex_date BETWEEN '%s' AND '%s'
                        GROUP BY fc_type
                        """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
                        
                
        # Fetch the results from the cursor
        results = cursor.fetchall()
        output = [{"type": row[0], "quantity": row[1]} for row in results]
        
        return jsonify(output)
    
    except Exception as e:
        return str(e)



    # return "Data is requested for dates from " + str(start) + " to " + str(end)




if __name__=='__main__':
    # app.debug = True
    # app.run()
    app.run(debug = True)