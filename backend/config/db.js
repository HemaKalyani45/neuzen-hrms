const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neuzen_hrms';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000 // Quick timeout if no local MongoDB service
    });
    console.log(`[MongoDB] Connected to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to primary MongoDB instance (${error.message}).`);
    console.warn(`[MongoDB Info] Switching to high-res built-in memory state storage engine for seamless operation.`);
    return false;
  }
};

module.exports = connectDB;
