const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Mongoose v7/v8 — NO options needed
    // useNewUrlParser and useUnifiedTopology 
    // are removed — they are now default
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;