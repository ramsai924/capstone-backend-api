const mongoose = require('mongoose')
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Name should not be empty"],
    },
    email: {
        type: String,
    },
    phonenumber: {
        type: String,
        required: [true, "Password should not be empty"],
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
        required: [true, "password should not be empty"],
    },
    role : {
        type: String,
        required : true
    },
    history : {
        type: [Schema.Types.ObjectId],
        ref: "seller_table_data"
    }
});

//Hash password before saving
userSchema.pre("save", function (next) {
    var salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)

    next()
})

//Generate jwt token
userSchema.methods.getjsonwebToken = function () {
    return jwt.sign({ id: this._id }, 'jsontokensss', {
        expiresIn: '30d'
    })
}

//compier hash password
userSchema.methods.compairHash = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const busyer_user = mongoose.model("user_model", userSchema)

module.exports = busyer_user;