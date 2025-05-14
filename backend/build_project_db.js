const connection = new Mongo("localhost:27017"),
  db = connection.getDB("apiary_db"),
  hiveReadings = db.getCollection("hive_readings");

// Create important indexes on metadata fields
hiveReadings.createIndex({ "timestamp": 1 });
hiveReadings.createIndex({ "metadata.hive_id": 1 });
hiveReadings.createIndex({ "metadata.location": 1 });

print("Indexes created successfully.");

// View one sample document
printjson(hiveReadings.findOne());
