import json
from datetime import datetime, timedelta

# Function to generate the data
def generate_data(start_date, end_date):
    data = []

    delta = timedelta(days=1)
    while start_date <= end_date:
        for i in range(1, 5):  # as maximum of 4 flowcells can be used in a day
            samples = i * 28  # each flowcell can hold a max of 28 samples
            data.append({
                "date": start_date.strftime("%m-%d-%Y"),
                "Samples": samples,
                "Flowcells": i
            })
        start_date += delta

    return data

# Set the date range
start_date = datetime.strptime('01-01-2022', "%m-%d-%Y")
end_date = datetime.strptime('03-31-2022', "%m-%d-%Y")

data = generate_data(start_date, end_date)

# Save the data to a file
with open('data.json', 'w') as file:
    json.dump(data, file, indent=4)

print("Data saved to data.json.")
