import json
from datetime import datetime, timedelta
import random
import string

def generate_data_1(start_date, end_date):
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

# start_date = datetime.strptime('10-10-2021', '%m-%d-%Y')
# end_date = datetime.strptime('03-31-2023', '%m-%d-%Y')

# data = generate_data_1(start_date, end_date)

# with open('data1.json', 'w') as f:
#     json.dump(data, f, indent=2)

def generate_data_2(start_date, end_date):
    date_range = (end_date - start_date).days + 1
    data = []
    types = ["SP", "S1", "S2", "S4"]

    for day in range(date_range):
        current_date = start_date + timedelta(days=day)
        fc_id = ''.join(random.choices(string.ascii_uppercase, k=10))
        type_choice = random.choice(types)

        data.append({
            "date": current_date.strftime("%m-%d-%Y"),
            "fc_id": fc_id,
            "type": type_choice
        })

    return data

# Define start_date and end_date
start_date = datetime.strptime('02-02-1988', '%m-%d-%Y')
end_date = datetime.strptime('07-11-2023', '%m-%d-%Y')

# Generate data with the modified function
data_modified = generate_data_2(start_date, end_date)

# Write the data to a JSON file
with open('data2.json', 'w') as f:
    json.dump(data_modified, f, indent=2)
