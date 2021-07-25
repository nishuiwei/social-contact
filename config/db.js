const mongoose = require('mongoose');
const colors = require('colors');
// 连接数据库

const configDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    // return conn;
    console.log(`MongoDB 已连接：${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
};

// const 

module.exports = configDB;