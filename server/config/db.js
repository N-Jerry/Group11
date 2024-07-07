require("dotenv").config();
const mongoose = require("mongoose");

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
const dbConnection = mongoose.connect(mongoURI)
.then(() => {
  console.log(`Connected to MongoDB database at ${mongoose.modelNames()}`);
  return mongoose.connection;
})
.catch((error) => {
  console.error("Error connecting to MongoDB database:", error);
  process.exit(1); // Exit the process if failed to connect
});

// Export the database connection
module.exports = dbConnection;
