const mongoose = require('mongoose')
//mongodb+srv://capstone:<password>@cluster0.azviz.mongodb.net/<dbname>?retryWrites=true&w=majority
//mongodb://localhost:27017/recycling
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