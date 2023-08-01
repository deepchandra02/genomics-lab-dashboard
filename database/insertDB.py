import psycopg2
import sys
import os
import glob
import datetime



# original_stdout = sys.stdout
# sys.stdout = open("log.txt", "a")

conn = psycopg2.connect(database="sidra",
                        host="localhost",
                        user="hosting-db",
                        password="mypassword",
                        port="5432")
# conn.autocommit = True
conn.set_session(autocommit=True)
cursor = conn.cursor()


def sql(command):
    try:
        cursor.execute(command)
        # print("Successfully Executed\n")
        # print(command)
        # conn.commit()
        # conn.close()
    except Exception as e:
        print("Failed to Execute\n")
        print(command)
        print("For the Exception\n")
        print(e)
    return 0


# Set up the paths
directory_path = "./input-data-for-externs/FC multiqc"
directory = "./input-data-for-externs"
fcqc_directory = directory + "/flowcell-qc-reports"
rawinfo_directory = directory + "/rawinfo-dirs"
runs_directory = directory + "/Runs"

col_numbers = 35

####################################################


def store_row(row):
    # table 15
    try:
        cursor.execute("INSERT INTO i5 (i5_id, i5_sequence) VALUES ('%s', '%s');"%(row["INDEX_I5_ID"], row["INDEX_I5_sequencing"])) #ON CONFLICT (i5_id) DO NOTHING
    except:
        # print("i5_sequence already exists; checking for data integrity...")
        sql("SELECT i5_sequence FROM i5 WHERE i5_id = '%s';"%(row["INDEX_I5_ID"], ))
        data = cursor.fetchone()
        if data != None and data[0] != row["INDEX_I5_sequencing"]:
            print("entry with i5_index %s already exists with i5_sequence %s"%(row["INDEX_I5_ID"], data[0]))
        # else:
            # print("data integrity checked for i5")

    #  table 17
    try:
        cursor.execute("INSERT INTO i7 (i7_id, i7_sequence) VALUES ('%s', '%s');"%(row["INDEX_I7_ID"], row["INDEX_I7_sequencing"])) #ON CONFLICT (i7_id) DO NOTHING
    except:
        # print("i7_sequence already exists; checking for data integrity...")
        sql("SELECT i7_sequence FROM i7 WHERE i7_id = '%s';"%(row["INDEX_I7_ID"], ))
        data = cursor.fetchone()
        if data != None and data[0] != row["INDEX_I7_sequencing"]:
            print("entry with i7_index %s already exists with i7_sequence %s"%(row["INDEX_I7_ID"], data[0]))
        # else:
            # print("data integrity checked for i7")

    # table sequencer
    sql("INSERT INTO sequencer (sequencer_id) VALUES ('%s') ON CONFLICT (sequencer_id) DO NOTHING;"%(row["Sequencer"], ))

    # table pi_projects
    try:
        cursor.execute("INSERT INTO pi_projects (project_id, pi, requirement) VALUES ('%s', '%s', '%s');"%(row["Project"], row["PI"], row["Data Requirement"]))
    except:
        # print("pi, project pair already exists; checking for data integrity...")
        sql("SELECT requirement FROM pi_projects WHERE project_id = '%s' AND pi = '%s';"%(row["Project"], row["PI"]))
        data = cursor.fetchone()
        if data != None and data[0] != row["Data Requirement"]:
            print("data requirement changed for project %s from %s to %s"%(row["Project"], data[0], row["Data Requirement"]))
        # else:
            # print("data integrity checked for pi_project")

    sql("SELECT earliest, latest FROM pi_projects WHERE project_id = '%s';"%(row["Project"]))
    data = cursor.fetchone()

    if data != None:
        assert(len(data) == 2)
        if data[0] == None or data[0] > row["Submission Date"]:
            sql("UPDATE pi_projects SET earliest = '%s' WHERE project_id = '%s' AND pi = '%s';"%(row["Submission Date"], row["Project"], row["PI"]))
        if data[1] == None or data[1] < row["Submission Date"]:
            sql("UPDATE pi_projects SET latest = '%s' WHERE project_id = '%s' AND pi = '%s';"%(row["Submission Date"], row["Project"], row["PI"]))
    else:
        print("date fetch failed")

    #  table submissions
    try:
        cursor.execute("INSERT INTO submissions (submission_id, project_id, date, datatype) VALUES ('%s', '%s', '%s', '%s');"%(row["Submission ID"], row["Project"], row["Submission Date"], row["Datatype"]))
    except Exception as e:
        if not str(e).startswith("duplicate key value violates"):
            print(e)
        # print("submission_id already exists; checking for data integrity...")


    if row["Comments"] != "":
        comments = row["Comments"].split(" ")
        assert(len(comments) == 5)
        sid = comments[0].split(":")
        srv = comments[1].split(":")
        rg = comments[2].split(":")
        cov = comments[3].split(":")
        anl = comments[4].split(":")

        assert(len(sid) == 0 or (len(sid) == 2 and sid[0] == "SUB"))
        assert(len(srv) == 0 or (len(srv) == 2 and srv[0] == "SRV"))
        assert(len(rg) == 0 or (len(rg) == 2 and rg[0] == "RG"))
        assert(len(cov) == 0 or (len(cov) == 2 and cov[0] == "COV"))
        assert(len(anl) == 0 or (len(anl) == 2 and anl[0] == "ANL"))
        assert(sid[1] == row["Submission ID"])

        sql("SELECT srv, rg, cov, anl FROM submissions WHERE submission_id = '%s';"%(row["Submission ID"]))
        data = cursor.fetchone()
        # if data != None:
            # assert(len(data) == 4)

        if (data == None or data[0] == None or data[0] == "_") and srv[1] != "":
            sql("UPDATE submissions SET srv = '%s' WHERE submission_id = '%s' ;"%(srv[1], row["Submission ID"]))
        elif data[0] != srv[1]:
            print("service data changed for submission id '%s' from '%s' to '%s'"%(row["Submission ID"], data[0], srv[1]))

        if (data == None or data[1] == None or data[1] == "_") and rg[1] != "":
            sql("UPDATE submissions SET rg = '%s' WHERE submission_id = '%s' ;"%(rg[1], row["Submission ID"]))
        elif data[1] != rg[1]:
            print("ref_genome data changed for submission id '%s' from '%s' to '%s'"%(row["Submission ID"], data[1], rg[1]))

        if (data == None or data[2] == None or data[2] == "_") and cov[1] != "":
            sql("UPDATE submissions SET cov = '%s' WHERE submission_id = '%s' ;"%(cov[1], row["Submission ID"]))
        elif data[2] != cov[1]:
            print("coverage data changed for submission id '%s' from '%s' to '%s'"%(row["Submission ID"], data[2], cov[1]))

        if (data == None or data[3] == None or data[3] == "_") and anl[1] != "":
            sql("UPDATE submissions SET anl = '%s' WHERE submission_id = '%s' ;"%(anl[1], row["Submission ID"]))
        elif data[3] != anl[1]:
            print("analysis data changed for submission id '%s' from '%s' to '%s'"%(row["Submission ID"], data[3], anl[1]))

        # else:
            # print("comment fetch failed")
            # sql("UPDATE submissions SET ")
            # sql("INSERT INTO submissions (submission_id, srv, rg, cov, anl) VALUES ('%s', '%s', '%s', '%s', '%s');"%(row["Submission ID"], srv[1], rg[1], cov[1], anl[1]))

    # if row["Remark"] != "":
    #     sql("SELECT remark FROM submissions WHERE submission_id = '%s' ;"%(row["Submission ID"]))
    #     data = cursor.fetchone()
    #     if data != None:
    #         assert(len(data) == 1)
    #         # print(data)
    #         if data[0] != None and str(data[0]) != 'None':
    #             if data[0] != row["Remark"]:
    #                 print("remark changed for submission '%s' from '%s' to '%s'"%(row["Submission ID"], data[0], row["Remark"]))
    #         elif row["Remark"] != "":
    #             sql("UPDATE submissions SET remark = '%s' WHERE submission_id = '%s' ;"%(data[0], row["Submission ID"]))
    #     else:
    #         sql("UPDATE submissions SET remark = '%s' WHERE submission_id = '%s' ;"%(row["Remark"], row["Submission ID"]))

    # table fc

    try:
        # print(row["Completion Date"])
        # print(row)
        cursor.execute("INSERT INTO flowcell (fc_id, fc_type, loaded_by, loading_date, completion_date, demultiplex_date, order_no, sequencer_id, position)\
        VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');"%(row["FC"], row["FC Type"], row["Loaded By"], row["Loading Date"], row["Completion Date"], row["Demultiplex Date"], row["Order No"], row["Sequencer"], row["Position"]))
        
    except Exception as e:
        # print(e)
        # print(row["Completion Date"])
        # print(row)
        # print("flowcell already exists; checking for data integrity...")
        sql("SELECT fc_type, loaded_by, loading_date, completion_date, demultiplex_date, order_no, sequencer_id, position FROM flowcell WHERE fc_id = '%s' ;"%(row["FC"])) # try except data integrity
        data = cursor.fetchone()
        if data != None:
            # print(data)
            assert(len(data) == 8)
            loading_date = datetime.datetime.strptime(row["Loading Date"], '%m/%d/%Y').date()
            completion_date = datetime.datetime.strptime(row["Completion Date"], '%m/%d/%Y').date()
            # demultiplex_date = datetime.datetime.strptime(row["Demultiplex Date", ])
            if data[0] != row["FC Type"]:
                print("FC Type data changed for flowcell %s from %s to %s"%(row["FC"], data[0], row["FC Type"]))
            if data[1] != row["Loaded By"]:
                print("Loaded By data changed for flowcell %s from %s to %s"%(row["FC"], data[1], row["Loaded By"]))
            if data[2] != loading_date:
                print("Loading Date data changed for flowcell %s from %s to %s"%(row["FC"], data[2], loading_date))
            if data[3] != completion_date:
                print("Completed Date data changed for flowcell %s from %s to %s"%(row["FC"], data[3], completion_date))
            if data[4] != row["Demultiplex Date"]:
                print("Demultiplex Date data changed for flowcell %s from %s to %s"%(row["FC"], data[4], row["Demultiplex Date"]))
            if data[5] != row["Order No"]:
                print("Order No data changed for flowcell %s from %s to %s"%(row["FC"], data[5], row["Order No"]))
            if data[6] != row["Sequencer"]:
                print("Sequencer data changed for flowcell %s from %s to %s"%(row["FC"], data[6], row["Sequencer"]))
            if data[7] != row["Position"]:
                print("position data changed for flowcell %s from %s to %s"%(row["FC"], data[7], row["Position"]))
            

        else:
            print("flowcell data fetch failed")

    # table pools
    try:
        cursor.execute("INSERT INTO pools (pooling_id, pf_reads, loading_conc, q30, fc_id) VALUES ('%s', '%s', '%s', '%s', '%s');"%(row["Pooling ID"], row["Reads (PF)"], row["Loading Conc."], row["Q30"], row["FC"]))
    except Exception as e:
        # print(e)
        # print("pools data already exists; checking for data integrity...")
        sql("SELECT pf_reads, loading_conc, q30, fc_id FROM pools WHERE pooling_id = '%s';"%(row["Pooling ID"])) # try except data integrity
        data = cursor.fetchone()
        if data != None:
            assert(len(data) == 4)
            if data[0] != row["Reads (PF)"]:
                print("pf_reads data changed for pool '%s' from '%s' to '%s'"%(row["Pooling ID"], data[0], row["Reads (PF)"]))
            if data[1] != row["Loading Conc."]:
                print("loading_conc data changed for pool '%s' from '%s' to '%s'"%(row["Pooling ID"], data[1], row["Loading Conc."]))
            if float(data[2]) != float(row["Q30"]):
                print("q30 data changed for pool '%s' from '%s' to '%s'"%(row["Pooling ID"], data[2], row["Q30"]))
            if data[3] != row["FC"]:
                print("fc_id data changed for pool '%s' from '%s' to '%s'"%(row["Pooling ID"], data[3], row["FC"]))
        else:
            print("pool data fetch failed")

    sql("SELECT lane_1, lane_2, lane_3, lane_4 FROM pools where pooling_id = '%s';"%(row["Pooling ID"]))
    data = cursor.fetchone()
    if data != None:
        assert(len(data) == 4)
        if data[0] == False and row["Lane"] == "L1":
            sql("UPDATE pools SET lane_1 = TRUE WHERE pooling_id = '%s';"%(row["Pooling ID"]))
        elif data[1] == False and row["Lane"] == "L2":
            sql("UPDATE pools SET lane_2 = TRUE WHERE pooling_id = '%s';"%(row["Pooling ID"]))
        if data[2] == False and row["Lane"] == "L3":
            sql("UPDATE pools SET lane_3 = TRUE WHERE pooling_id = '%s';"%(row["Pooling ID"]))
        if data[3] == False and row["Lane"] == "L4":
            sql("UPDATE pools SET lane_4 = TRUE WHERE pooling_id = '%s';"%(row["Pooling ID"]))
    else:
        print("pool lane data fetch failed")

    # table samples
    sql("SELECT pooling_id, sample_name, submission_id, qpcr, fragment, labchip_conc, well, pre_norm_well, i5_id, i7_id, data_sample, urgent, remark, lib_received, sample_qc, lib_qc\
     FROM samples WHERE sample_id = '%s' AND fc_id = '%s';"%(row["Sample Name"], row["FC"]))
    data = cursor.fetchone()
    if data == None:
        sql("INSERT INTO samples (sample_id, pooling_id, fc_id, sample_name, submission_id, fragment, well, pre_norm_well, i5_id, i7_id, data_sample, urgent, remark, lib_received, sample_qc, lib_qc)\
        VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s', '%s' );"%(row["Sample Name"], row["Pooling ID"], row["FC"], row["Original Sample Name"], row["Submission ID"], row["Fragment size (bp)"], row["Well"], row["Pre-Norm Well"], row["INDEX_I5_ID"], row["INDEX_I7_ID"], row["Data_Sample_Status"],
                                                                                                         row["Urgency"], row["Remark"], row["Libaries and info received date"], row["Sample QC P/F"], row["Lib QC P/F"]))
    else:
        assert(len(data) == 16)
        if data[0] != row["Pooling ID"]:
            print("Pooling ID data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[0], row["Pooling ID"]))
        if data[1] != row["Original Sample Name"]:
            print("Original Sample Name data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[1], row["Original Sample Name"]))
        if data[2] != row["Submission ID"]:
            print("Submission ID data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[2], row["Submission ID"]))
        if float(data[3]) != float(row["QPCR Conc. (nM) / iseq output"]):
            print("QPCR Conc. (nM) / iseq output data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[3], row["QPCR Conc. (nM) / iseq output"]))
        if int(data[4]) != int(row["Fragment size (bp)"]):
            print("Fragment size (bp) data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[4], row["Fragment size (bp)"]))
        if float(data[5]) != float(row["LabChip/Bioanalyzer Conc. (nM)"]):
            print("LabChip/Bioanalyzer Conc. (nM) data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[5], row["LabChip/Bioanalyzer Conc. (nM)"]))
        if data[6] != row["Well"]:
            print("Well data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[6], row["Well"]))
        if data[7] != row["Pre-Norm Well"]:
            print("Pre-Norm Well data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[7], row["Pre-Norm Well"]))
        if data[8] != row["INDEX_I5_ID"]:
            print("INDEX_i5_ID data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[8], row["INDEX_i5_ID"]))
        if data[9] != row["INDEX_I7_ID"]:
            print("INDEX_i7_ID data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[9], row["INDEX_i7_ID"]))
        if data[10] != row["Data_Sample_Status"]:
            print("Data_Sample_status data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[10], row["Data_Sample_status"]))
        if data[11] != row["Urgency"]:
            print("Urgency data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[11], row["Urgency"]))
        if data[12] != row["Remark"]:
            print("Remark data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[12], row["Remark"]))        
        if data[13] != datetime.datetime.strptime(row["Libaries and info received date"], "%Y%m%d").date():
            print("Libaries and info received date data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[13], row["Libaries and info received date"]))
        if data[14] != row["Sample QC P/F"]:
            print("Sample QC P/F data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[14], row["Sample QC P/F"]))
        if data[15] != row["Lib QC P/F"]:
            print("Lib QC P/F data changed for sample '%s' and fc '%s' from '%s' to '%s'"%(row["Sample Name"], row["FC"], data[15], row["Lib QC P/F"]))

    if row["QPCR Conc. (nM) / iseq output"] != "":
        sql("UPDATE samples SET qpcr = '%s' WHERE sample_id = '%s' AND fc_id = '%s';"%(row["QPCR Conc. (nM) / iseq output"], row["Sample Name"], row["FC"]))
    if row["LabChip/Bioanalyzer Conc. (nM)"] != "":
        sql("UPDATE samples SET labchip_conc = '%s' WHERE sample_id = '%s' AND fc_id = '%s';"%(row["LabChip/Bioanalyzer Conc. (nM)"], row["Sample Name"], row["FC"]))
    

    return 0


##################################################################


def store_fc(fc):
    files = os.listdir(runs_directory)
    for file_name in files:
        tokens = file_name.split("_")
        assert(len(tokens) == 4)
        if tokens[-1][1:] == fc:
            raw_info_filename = tokens[0]
            sequencer = tokens[1]
            run_id = tokens[2] ########################
            if tokens[3][0] == "A":
                position = True
            elif tokens[3][0] == "B":
                position = False
            else:
                position = None
            break
    else:
        print("No runs folder corresponding fc ", fc)
        exit(1)

    # Parse the raw.info file
    raw_info_file_path = os.path.join(rawinfo_directory, raw_info_filename)
    if os.path.exists(raw_info_file_path):
        print(datetime.datetime.now(), f" : Parsing '{raw_info_filename}' for '{fc}'...")
        table = []
        # Open the raw.info file and read its content
        with open(raw_info_file_path + "/raw.info", "r") as raw_info_file:
            fields = raw_info_file.readline().rstrip('\n').split('\t')
            assert(len(fields) == col_numbers)
            for line in raw_info_file:
                row = dict()
                cells = line.split('\t')
                assert(len(cells) == col_numbers)
                for i in range(col_numbers):
                  row[fields[i].strip()] = cells[i].strip()

                if row["FC"] == fc:
                    row["Demultiplex Date"] = datetime.datetime.strptime('20' + raw_info_filename, "%Y%m%d").date()
                    row["Sequencer"] = sequencer
                    row["Position"] = position
                    tokens = row["Project name"].split("_")
                    row["Project"] = tokens[1]
                    row["PI"] = tokens[0]
                    row["Submission Date"] = datetime.datetime.strptime('20' + tokens[-3], '%Y%m%d').date()
                    row["Datatype"] = tokens[-2]
                    row.pop("Submission ID", None)
                    row.pop("Run Duration (H:M)", None)
                    row.pop("Data Update Contacts", None)
                    row["Submission ID"] = row["Project name"]
                    row.pop("Project name", None)

                    row["Sample Name"] = row["Sample Name"].replace(" ", "")

                    if "Reads (PF B )" in row:
                        row["Reads (PF)"] = row["Reads (PF B )"] + " B"
                        row.pop("Reads (PF B )", None)
                    elif "Reads (PF M )" in row:
                        row["Reads (PF)"] = row["Reads (PF M )"] + " M"
                        row.pop("Reads (PF M )", None)

                    if "Loading Conc. (pM)" in row:
                        row["Loading Conc."] = row["Loading Conc. (pM)"] + " pM"
                        row.pop("Loading Conc. (pM)", None)
                    elif "Loading Conc. (nM)" in row:
                        row["Loading Conc."] = row["Loading Conc. (nM)"] + " nM"
                        row.pop("Loading Conc. (nM)", None)

                    if row["Urgency"] == "Urgent":
                        row["Urgency"] = True
                    else:
                        row["Urgency"] = False
                    
                    if row["Data_Sample_Status"] == "":
                        row["Data_Sample_Status"] = "New"

                    if row["Sample QC P/F"] == "P":
                        row["Sample QC P/F"] = True
                    else:
                        row["Sample QC P/F"] = False
                    
                    if row["Lib QC P/F"] == "P":
                        row["Lib QC P/F"] = True
                    else:
                        row["Lib QC P/F"] = False
                    
                    store_row(row)
                        # table.append(row)


    else:
      print(datetime.datetime.now(), " : No raw info file corresponding date " + raw_info_file_path + "for fc " + fc)
      exit(1)



###############################################################################
# Get the list of HTML files in the directory
def main():
    FC = []
    subdirectories = [entry.name for entry in os.scandir(fcqc_directory) if entry.is_dir()]

    for dir in subdirectories:
        subdir = fcqc_directory + "/" + dir
        html_files = glob.glob(os.path.join(subdir, "*.html"))
        if html_files:
            for html_file_path in html_files:
                print(datetime.datetime.now(), " : Found HTML file generated for .", html_file_path)
                fc = html_file_path.split("/")[-1]
                FC.append(fc.split(".")[0])

    sql("SELECT fc_id FROM flowcell;")
    data = cursor.fetchall()

    demultiplexed_FC = set()
    for row in data:
        demultiplexed_FC.add(row[0])

    for fc in FC:
        if fc not in demultiplexed_FC:
            store_fc(fc)
            print(datetime.datetime.now(), " : Data stored in the database for fc" + fc)
    
    return 0



main()
