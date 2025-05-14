from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['apiary_db']
collection = db['hive_readings']

@app.route('/')
def home():
    return "<h2>🐝 Welcome to the Apiary Data API! 🐝</h2>"

@app.route('/api/readings', methods=['GET'])
def get_readings():
    hive_id = request.args.get('hive_id')
    location = request.args.get('location')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    query = {"metadata.hive_id": hive_id}
    if location:
        query["metadata.location"] = location
    if start_date and end_date and start_date != "" and end_date != "":
        query["timestamp"] = {
            "$gte": datetime.strptime(start_date, "%Y-%m-%d"),
            "$lte": datetime.strptime(end_date, "%Y-%m-%d")
        }

    results = []
    for doc in collection.find(query).sort('timestamp', 1):
        results.append({
            "hive_id": doc['metadata']['hive_id'],
            "location": doc['metadata']['location'],
            "timestamp": doc['timestamp'].strftime("%Y-%m-%d %H:%M"),
            "temperature": doc.get('temperature'),
            "humidity": doc.get('humidity')
        })
    return jsonify(results)


@app.route('/api/averages', methods=['GET'])
def get_averages():
    hive_id = request.args.get('hive_id')
    location = request.args.get('location')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    match_stage = {"$match": {
        "metadata.hive_id": hive_id,
        "temperature": { "$ne": None } 
    }}
    if location:
        match_stage["$match"]["metadata.location"] = location
    if start_date and end_date:
        match_stage["$match"]["timestamp"] = {
            "$gte": datetime.strptime(start_date, "%Y-%m-%d"),
            "$lte": datetime.strptime(end_date, "%Y-%m-%d")
        }

    pipeline = [
        match_stage,
        {
            "$group": {
                "_id": {
                    "date": { "$dateToString": { "format": "%Y-%m-%d", "date": "$timestamp" } }
                },
                "avg_temperature": { "$avg": "$temperature" }
            }
        },
        { "$sort": { "_id.date": 1 } }
    ]

    results = []
    for doc in collection.aggregate(pipeline):
        results.append({
            "date": doc["_id"]["date"],
            "avg_temperature": round(doc["avg_temperature"], 2) if doc.get("avg_temperature") else None
        })
    return jsonify(results)

@app.route('/api/monthlyaverages', methods=['GET'])
def get_monthly_averages():
    hive_id = request.args.get('hive_id')
    location = request.args.get('location')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    match_stage = {"$match": {
        "metadata.hive_id": hive_id,
        "temperature": { "$ne": None } 
    }}
    if location:
        match_stage["$match"]["metadata.location"] = location
    if start_date and end_date:
        match_stage["$match"]["timestamp"] = {
            "$gte": datetime.strptime(start_date, "%Y-%m-%d"),
            "$lte": datetime.strptime(end_date, "%Y-%m-%d")
        }

    pipeline = [
        match_stage,
        {
            "$group": {
                "_id": {
                    "month": { "$dateToString": { "format": "%Y-%m", "date": "$timestamp" } }
                },
                "avg_temperature": { "$avg": "$temperature" }
            }
        },
        { "$sort": { "_id.month": 1 } }
    ]

    results = []
    for doc in collection.aggregate(pipeline):
        results.append({
            "month": doc["_id"]["month"],
            "avg_temperature": round(doc["avg_temperature"], 2) if doc.get("avg_temperature") else None
        })
    return jsonify(results)

@app.route('/api/minmax', methods=['GET'])
def get_minmax():
    hive_id = request.args.get('hive_id')
    location = request.args.get('location')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    query = {"metadata.hive_id": hive_id}
    if location:
        query["metadata.location"] = location
    if start_date and end_date:
        query["timestamp"] = {
            "$gte": datetime.strptime(start_date, "%Y-%m-%d"),
            "$lte": datetime.strptime(end_date, "%Y-%m-%d")
        }

    highest = collection.find(query).sort("temperature", -1).limit(1)
    lowest = collection.find(query).sort("temperature", 1).limit(1)

    high = next(highest, None)
    low = next(lowest, None)

    result = {
        "highest_temperature_day": {
            "_id": high['timestamp'].strftime("%Y-%m-%d") if high else None,
            "max_temp": high.get('temperature') if high else None
        },
        "lowest_temperature_day": {
            "_id": low['timestamp'].strftime("%Y-%m-%d") if low else None,
            "min_temp": low.get('temperature') if low else None
        }
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
