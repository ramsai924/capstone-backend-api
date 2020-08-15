const mongoose = require('mongoose')
var bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const seller_user_Schema = Schema({
        name: {
            type: String,
            required: [true, "Name should not be empty"],
        },
        email: {
            type: String,
            unique : true,
            required: [true, "Email should not be empty"],
        },
        phonenumber: {
            type: String,
            required: [true, "phonenumber should not be empty"],
        },
        password: {
            type: String,
            minlength : 6,
            select: false,
            required: [true, "password should not be empty"],
        },
        usertype : {
            type : String,
            default : "seller"
        },
        soldHistory : {
            type: [Schema.Types.ObjectId],
            ref: "seller_table_data",
        }
})

seller_user_Schema.pre('save',function(next){
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);

    next()
})

seller_user_Schema.methods.compairHash = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const seller_user = mongoose.model("seller_user_table", seller_user_Schema);

module.exports = seller_user;