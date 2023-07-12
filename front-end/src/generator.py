import json
from datetime import datetime, timedelta
import random

def generate_data(start_date, end_date):
    date_range = (end_date - start_date).days + 1
    data = []

    for day in range(date_range):
        current_date = start_date + timedelta(days=day)
        num_flowcells = random.randint(1, 4)
        num_samples = random.randint(1, num_flowcells * 28)

        data.append({
            "date": current_date.strftime("%m-%d-%Y"),
            "Samples": num_samples,
            "Flowcells": num_flowcells
        })

    return data

start_date = datetime.strptime('02-02-1988', '%m-%d-%Y')
end_date = datetime.strptime('07-11-2023', '%m-%d-%Y')

data = generate_data(start_date, end_date)

with open('data2.json', 'w') as f:
    json.dump(data, f, indent=2)

# Load the data from the file
with open("data2.json") as file:
    data = json.load(file)

# Initialize cumulative counters
cumulative_samples = 0
cumulative_flowcells = 0

# Iterate through the data and add the cumulative values
for entry in data:
    cumulative_samples += entry["Samples"]
    cumulative_flowcells += entry["Flowcells"]
    entry["SamplesTotal"] = cumulative_samples
    entry["FlowcellsTotal"] = cumulative_flowcells

with open("updated_data2.json", "w") as f:
    json.dump(data, f)
