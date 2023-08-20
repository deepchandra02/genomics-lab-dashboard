import json
import random
from datetime import datetime, timedelta

# Load the JSON data
with open("front-end/src/data/data0.json") as f:
    data = json.load(f)

# Add the new fields
for record in data:
    if record.get("loading_date") != "_":
        loading_date = datetime.strptime(record["loading_date"], "%Y-%m-%d")
        staging_date = loading_date + timedelta(days=random.choice([1, 2]))

        # Decide whether to set a date or "_" for each field
        if random.choice([True, False]):
            record["staging_date"] = staging_date.strftime("%Y-%m-%d")
            record["staging_error"] = random.choice([True, False])
            processing_date = staging_date + timedelta(days=random.choice([1, 2]))
            if random.choice([True, False]):
                record["processing_date"] = processing_date.strftime("%Y-%m-%d")
                lane_fastq = processing_date + timedelta(days=random.choice([1, 2]))
                if random.choice([True, False]):
                    record["lane_fastq"] = lane_fastq.strftime("%Y-%m-%d")
                    merged_fastq = lane_fastq + timedelta(days=random.choice([1, 2]))
                    if random.choice([True, False]):
                        record["merged_fastq"] = merged_fastq.strftime("%Y-%m-%d")
                        releasing_date = merged_fastq + timedelta(days=random.choice([1, 2]))
                        if random.choice([True, False]):
                            record["releasing_date"] = releasing_date.strftime("%Y-%m-%d")
                        else:
                            record["releasing_date"] = "_"
                    else:
                        record["merged_fastq"] = "_"
                        record["releasing_date"] = "_"
                else:
                    record["lane_fastq"] = "_"
                    record["merged_fastq"] = "_"
                    record["releasing_date"] = "_"
            else:
                record["processing_date"] = "_"
                record["lane_fastq"] = "_"
                record["merged_fastq"] = "_"
                record["releasing_date"] = "_"
        else:
            record["staging_date"] = "_"
            record["processing_date"] = "_"
            record["lane_fastq"] = "_"
            record["merged_fastq"] = "_"
            record["releasing_date"] = "_"
    else:
        record["staging_date"] = "_"
        record["processing_date"] = "_"
        record["lane_fastq"] = "_"
        record["merged_fastq"] = "_"
        record["releasing_date"] = "_"

# Write the updated data back to the file
with open("front-end/src/data/data0_updated.json", "w") as f:
    json.dump(data, f)
