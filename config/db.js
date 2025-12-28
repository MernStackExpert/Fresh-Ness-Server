// config/db.js
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

let db;

// MongoDB client
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// connectDB function
const connectDB = async () => {
  if (!db) {
    await client.connect();
    db = client.db("ecommerceDB");
    console.log("✅ MongoDB connected");
  }
  return db;
};

// export
module.exports = { connectDB, ObjectId };
