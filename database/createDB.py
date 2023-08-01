import psycopg2
import sys


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
    except Exception as e:
        print("Failed to Execute\n")
        print(command)
        print("For the Exception\n")
        print(e)
    return 0


sql("CREATE TABLE pi_projects (\
      project_id      VARCHAR(32) PRIMARY KEY,\
      pi              VARCHAR(08) NOT NULL,\
      requirement     VARCHAR(32) DEFAULT '_',\
      earliest        DATE DEFAULT NULL,\
      latest          DATE DEFAULT NULL\
  );")


sql("CREATE TABLE i5 (\
      i5_id           VARCHAR(16) PRIMARY KEY,\
      i5_sequence     VARCHAR(10) DEFAULT NULL CHECK (char_length(i5_sequence) >= 06)\
  );")

sql("CREATE TABLE i7 (\
      i7_id           VARCHAR(16) PRIMARY KEY,\
      i7_sequence     VARCHAR(10) DEFAULT NULL CHECK (char_length(i7_sequence) >= 06)\
  );")

sql("CREATE TABLE sequencer (\
      sequencer_id    VARCHAR(16) PRIMARY KEY\
  );")

sql("CREATE TABLE submissions (\
      submission_id   VARCHAR(64) PRIMARY KEY,\
      project_id      VARCHAR(32) REFERENCES pi_projects (project_id),\
      date            DATE NOT NULL CHECK (date <= current_date),\
      cov             VARCHAR(16) DEFAULT '_',\
      srv             VARCHAR(16) DEFAULT '_',\
      rg              VARCHAR(16) DEFAULT '_',\
      anl             VARCHAR(16) DEFAULT '_',\
      datatype        VARCHAR(16) NOT NULL\
  );")


sql("CREATE TABLE flowcell (\
      fc_id           VARCHAR(16) PRIMARY KEY,\
      fc_type         VARCHAR(16) NOT NULL CHECK (char_length(fc_type) > 0),\
      loaded_by       VARCHAR(08) NOT NULL CHECK (char_length(loaded_by) > 0),\
      loading_date    DATE     NOT NULL CHECK (loading_date <= current_date),\
      completion_date DATE     NOT NULL CHECK (completion_date <= current_date),\
      demultiplex_date DATE    NOT NULL CHECK (demultiplex_date <= current_date),\
      stage_date       DATE    DEFAULT NULL CHECK (stage_date <= current_date),\
      process_date     DATE    DEFAULT NULL CHECK (process_date <= current_date),\
      order_no        VARCHAR(32) NOT NULL CHECK (char_length(order_no) > 0),\
      sequencer_id    VARCHAR(16) REFERENCES sequencer (sequencer_id),\
      run_duration    SMALLINT CHECK ((run_duration ISNULL) OR (run_duration > 0)) DEFAULT NULL,\
      position        BOOLEAN NOT NULL,\
      CHECK (completion_date >= loading_date)\
  );")
# stage_date#########################
sql("CREATE TABLE pools (\
      pooling_id      VARCHAR(32) PRIMARY KEY,\
      pf_reads        VARCHAR(08) NOT NULL,\
      loading_conc    VARCHAR(08) NOT NULL,\
      q30             NUMERIC(5, 3) NOT NULL CHECK ((q30 >= 0) AND (q30 <= 100)),\
      lane_1          BOOLEAN  NOT NULL DEFAULT FALSE,\
      lane_2          BOOLEAN  NOT NULL DEFAULT FALSE,\
      lane_3          BOOLEAN  NOT NULL DEFAULT FALSE,\
      lane_4          BOOLEAN  NOT NULL DEFAULT FALSE,\
      fc_id           VARCHAR(16) REFERENCES flowcell (fc_id)\
);")

sql("CREATE TYPE status AS ENUM ('New', 'Top-up', 'Repeat');")

sql("CREATE TABLE samples (\
      sample_id       VARCHAR(10) NOT NULL CHECK (char_length(sample_id) = 10),\
      pooling_id      VARCHAR(32) REFERENCES pools (pooling_id),\
      fc_id           VARCHAR(16) REFERENCES flowcell (fc_id),\
      sample_name     VARCHAR(64) NOT NULL,\
      submission_id   VARCHAR(64) REFERENCES submissions (submission_id),\
      qpcr            NUMERIC(4, 2) CHECK ((qpcr ISNULL) OR (qpcr >= 0)) DEFAULT NULL,\
      fragment        SMALLINT NOT NULL CHECK (fragment >= 0),\
      labchip_conc    NUMERIC(5, 2) CHECK ((labchip_conc ISNULL) OR (labchip_conc >= 0)) DEFAULT NULL,\
      well            VARCHAR(32) NOT NULL CHECK (char_length(well) > 0),\
      pre_norm_well   VARCHAR(32) DEFAULT '_',\
      i5_id           VARCHAR(16) REFERENCES i5 (i5_id),\
      i7_id           VARCHAR(16) REFERENCES i7 (i7_id),\
      data_sample     status NOT NULL,\
      urgent          BOOLEAN NOT NULL DEFAULT FALSE,\
      remark          text DEFAULT '_',\
      lib_received    DATE NOT NULL CHECK (lib_received <= current_date),\
      sample_qc       BOOLEAN NOT NULL DEFAULT FALSE,\
      lib_qc          BOOLEAN NOT NULL DEFAULT FALSE,\
      error           VARCHAR(64) NOT NULL DEFAULT '_',\
      stage_date       DATE    DEFAULT NULL CHECK (stage_date <= current_date),\
      merged          BOOLEAN DEFAULT FALSE,\
      lane            BOOLEAN DEFAULT FALSE,\
      PRIMARY KEY (sample_id, fc_id)\
  );")

# conn.close()
