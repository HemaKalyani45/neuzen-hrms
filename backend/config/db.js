const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = 'mongodb+srv://hemakalyani56_db_user:6zJ0hbsWm30eSyWG@cluster0.rtjneo7.mongodb.net/?appName=Cluster0';
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
