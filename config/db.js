const mongoose = require('mongoose')
//mongodb+srv://capstone:<password>@cluster0.azviz.mongodb.net/<dbname>?retryWrites=true&w=majority
//mongodb://localhost:27017/recycling
const db = mongoose
  .connect("mongodb+srv://capstone:capstone@cluster0.azviz.mongodb.net/capstone-backend-api?retryWrites=true&w=majority", {
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