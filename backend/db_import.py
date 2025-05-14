import pandas as pd
from pymongo import MongoClient
from datetime import datetime
import os

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['apiary_db']
collection = db['hive_readings']

# CSV files and metadata
csv_files = [
    ("hive-b_outside-hive.csv", "b", "outside-hive"),
    ("hive-b_upper-brood.csv", "b", "upper-brood"),
    ("hive-c_upper-brood.csv", "c", "upper-brood"),
    ("hive-e_outside-hive.csv", "e", "outside-hive"),
    ("hive-e_upper-brood.csv", "e", "upper-brood")
]

DATA_DIR = "./data"

def parse_and_insert(file_name, hive_id, location):
    path = os.path.join(DATA_DIR, file_name)
    df = pd.read_csv(path)

    for col in df.columns:
        df[col] = df[col].astype(str).str.strip()

    records = []
    for _, row in df.iterrows():
        try:
            timestamp = datetime.strptime(row['Local_TimeStamp'], '%m/%d/%Y %I:%M %p')
        except Exception as e:
            print(f"Skipping row due to timestamp parsing error: {row['Local_TimeStamp']}")
            continue

        record = {
            "metadata": {
                "hive_id": hive_id,
                "location": location,
            },
            "timestamp": timestamp,
            "temperature": float(row.get('Temperature', None)) if row.get('Temperature') else None,
            "humidity": float(row.get('Humidity', None)) if row.get('Humidity') else None,
        }
        records.append(record)

    if records:
        collection.insert_many(records)
        print(f"Inserted {len(records)} records from {file_name}")
    else:
        print(f"No valid records found in {file_name}")

def main():
    for file_name, hive_id, location in csv_files:
        parse_and_insert(file_name, hive_id, location)

if __name__ == "__main__":
    main()
