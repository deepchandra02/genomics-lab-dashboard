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

start_date = datetime.strptime('01-01-2022', '%m-%d-%Y')
end_date = datetime.strptime('03-31-2022', '%m-%d-%Y')

data = generate_data(start_date, end_date)

with open('data.json', 'w') as f:
    json.dump(data, f, indent=2)
