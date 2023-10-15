require('dotenv').config();
const mongoose = require('mongoose');
const { MONGO_URI } = process.env;

async function connectDB() {
  try {
    await mongoose.connect(`${MONGO_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connect successfully!');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connectDB };
