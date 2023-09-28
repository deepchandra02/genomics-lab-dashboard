# an object of WSGI application
from flask import Flask, jsonify, request
import datetime
import psycopg2
from flask_cors import CORS
import json
import os
from decimal import Decimal # for JSONEncoder

app = Flask(__name__)   # Flask constructor
CORS(app)
conn = psycopg2.connect(database="sidra",
                        host="localhost",
                        user="deepc",
                        password="mypassword",
                        port="5432")
conn.set_session(autocommit=True)
cursor = conn.cursor()

#  for debugging, don't remove
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return super(JSONEncoder, self).default(obj)
    
def sql(command):
    try:
        cursor.execute(command)
    except Exception as e:
        return {"Exception" : str(e)}
    results =  cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    rows = []
    for row in results:
        row_dict = {}
        for i, column in enumerate(columns):
            row_dict[column] = row[i]
        rows.append(row_dict)
    return rows    

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

@app.route('/Progress/refresh')
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

@app.route('/Progress/release/',methods=['PUT'])
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
    filters = json.loads(request.args.get('filters', '[]'))
    sorting = json.loads(request.args.get('sorting', '[]'))
    
    print(filters)

    # Multiple column sorting isn't available
    assert(len(sorting) < 2)
    

    format = {"run_duration" : "999" , "q30": "99D999", "qpcr" : "9D99", "fragment" : "999", "labchip_conc" : "999D99", "mean_qscore" : "99D999", "yieldQ30" : "999999999999"}


    # Build the WHERE clause for filteri
    where_clause = "WHERE"
    for filter in filters:
        value = filter['value']

        if isinstance(value, str):
            if filter['id'] in format:
                where_clause += f" to_char({resolve(filter['id'])}, '{format[filter['id']]}') LIKE '%{value}%'"
            else:
                where_clause += f" {resolve(filter['id'])} LIKE '%{value}%'"
        elif isinstance(value, list):
            where_clause += f" {resolve(filter['id'])} IN {tuple(value)}"
        else:
            return "value type inappropriate in filter"
        where_clause += " AND "

    where_clause = where_clause[:-5] # removing the last 'AND'

    print(where_clause)

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
        {order_by_clause};
    """
    results = sql(query)

    print(query)
    print(results)

    # DEBUGGING< DON'T REMOVE
    # Write the results to a JSON file
    # with open('./front-end/src/newdata/data0.json', 'w') as f:
    #     json.dump(results, f, cls=JSONEncoder)
    return jsonify(results)


@app.route('/data1/<date>')
def data1(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("""SELECT
                            TO_CHAR(demultiplex_date, 'MM-DD-YYYY') AS date,
                            COUNT(DISTINCT samples.sample_id) AS "Samples",
                            COUNT(DISTINCT samples.fc_id) AS "Flowcells",
                            SUM(COUNT(DISTINCT samples.sample_id)) OVER (ORDER BY demultiplex_date) AS "SamplesTotal",
                            SUM(COUNT(DISTINCT samples.fc_id)) OVER (ORDER BY demultiplex_date) AS "FlowcellsTotal"
                        FROM
                            flowcell
                        INNER JOIN
                            samples ON flowcell.fc_id = samples.fc_id
                        WHERE
                            demultiplex_date BETWEEN '%s' AND '%s'
                        GROUP BY
                            demultiplex_date
                        ORDER BY
                            demultiplex_date;"""%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
    
    # for debugging, don't remove
    # Write the results to a JSON file
    with open('./front-end/src/newdata/data1.json', 'w') as f:
        json.dump(results, f, cls=JSONEncoder)            
    return jsonify(results)


@app.route('/data2a/<date>')
def data2a(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("""
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
                            samples sa ON s.submission_id = sa.submission_id
                        LEFT JOIN
                            flowcell f ON sa.fc_id = f.fc_id
                        WHERE
                            f.demultiplex_date BETWEEN '%s' AND '%s'
                        GROUP BY
                            pi;
                    """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
    
    # for debugging, don't remove
    # Write the results to a JSON file
    with open('./front-end/src/newdata/data2a.json', 'w') as f:
        json.dump(results, f, cls=JSONEncoder)

    return jsonify(results)

@app.route('/data2b/<date>')
def data2b(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("""
                        SELECT 
                            p.pi, p.project_id, COUNT(*) as quantity
                        FROM
                            pi_projects p
                        LEFT JOIN
                            submissions s ON p.project_id = s.project_id
                        LEFT JOIN
                            samples sa ON s.submission_id = sa.submission_id
                        LEFT JOIN
                            flowcell f ON sa.fc_id = f.fc_id
                        WHERE
                            f.demultiplex_date BETWEEN '%s' AND '%s'
                        GROUP BY
                            p.pi, p.project_id;
                    """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
    if "Exception" not in results:
        output = []
        for row in results:
            for dct in output:
                if row["pi"] == dct["pi"]:
                    dct[row["project_id"]] = row["quantity"]
                    break
            else:
                output.append({"pi": row["pi"], row["project_id"]:row["quantity"]})
        
        # for debugging, don't remove
        # Write the results to a JSON file
        with open('./front-end/src/newdata/data2b.json', 'w') as f:
            json.dump(output, f, cls=JSONEncoder)
        return jsonify(output)
    return jsonify(results)

@app.route('/data2c/<date>')
def data2c(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("""
                        SELECT 
                            p.pi as "pi", p.project_id as "project", s.rg as "genome", COUNT(*) as "sample_count"
                        FROM
                            pi_projects p
                        LEFT JOIN
                            submissions s ON p.project_id = s.project_id
                        LEFT JOIN
                            samples sa ON s.submission_id = sa.submission_id
                        LEFT JOIN
                            flowcell f ON sa.fc_id = f.fc_id
                        WHERE
                            f.demultiplex_date BETWEEN '%s' AND '%s'
                        GROUP BY
                            p.pi, p.project_id, s.rg
                        ORDER BY
                            "sample_count" DESC;
                    """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))
    
    # for debugging, don't remove
    # Write the results to a JSON file
    with open('./front-end/src/newdata/data2c.json', 'w') as f:
        json.dump(results, f, cls=JSONEncoder)

    return jsonify(results)

@app.route('/data3/<date>')
def data3(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("""
                        SELECT fc_type as type, COUNT(*) as quantity
                        FROM flowcell f
                        WHERE demultiplex_date BETWEEN '%s' AND '%s'
                        GROUP BY fc_type
                        """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))

    # for debugging, don't remove
    # Write the results to a JSON file
    with open('./front-end/src/newdata/data3.json', 'w') as f:
        json.dump(results, f, cls=JSONEncoder)

    return jsonify(results)

@app.route('/data4/<date>')
def data4(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("""
                        SELECT srv as type, COUNT(*) as quantity
                        FROM submissions sub
                        LEFT JOIN samples s ON s.submission_id = sub.submission_id
                        LEFT JOIN flowcell f ON f.fc_id = s.fc_id
                        WHERE f.demultiplex_date BETWEEN '%s' AND '%s'
                        GROUP BY srv
                        """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))

    # for debugging, don't remove
    # Write the results to a JSON file
    with open('./front-end/src/newdata/data4.json', 'w') as f:
        json.dump(results, f, cls=JSONEncoder)

    return jsonify(results)

@app.route('/data5/<date>')
def data5(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("""
                        SELECT sequencer_id as type, COUNT(*) as quantity
                        FROM flowcell f
                        WHERE demultiplex_date BETWEEN '%s' AND '%s'
                        GROUP BY sequencer_id
                        """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))

    # for debugging, don't remove
    # Write the results to a JSON file
    with open('./front-end/src/newdata/data5.json', 'w') as f:
        json.dump(results, f, cls=JSONEncoder)

    return jsonify(results)

@app.route('/data6/<date>')
def data6(date):
    try:
        start, end = parseDate(date)
    except:
        return "format should be 'yyyymmdd-yyyymmdd'"

    results = sql("""
                        SELECT rg as type, COUNT(*) as quantity
                        FROM submissions sub
                        LEFT JOIN samples s ON s.submission_id = sub.submission_id
                        LEFT JOIN flowcell f ON f.fc_id = s.fc_id
                        WHERE f.demultiplex_date BETWEEN '%s' AND '%s'
                        GROUP BY rg
                        """%(start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')))

    # for debugging, don't remove
    # Write the results to a JSON file
    with open('./front-end/src/newdata/data6.json', 'w') as f:
        json.dump(results, f, cls=JSONEncoder)
    
    return jsonify(results)

if __name__=='__main__':
    # app.debug = True
    # app.run()
    app.run(debug = True)
