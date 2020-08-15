const mongoose = require('mongoose')

const db = mongoose
  .connect("mongodb://localhost:27017/recycling", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("conneted to recycling db");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = db;