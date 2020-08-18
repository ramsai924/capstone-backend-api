const mongoose =  require('mongoose')
var bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const buyerschema = Schema({
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
            required: [true, "Password should not be empty"],
        },
        password: {
            type: String,
            minlength : 6,
            select: false,
            required: [true, "password should not be empty"],
        },
        usertype : {
            type : String,
            default : "buyer"
        },
        completedOrders : {
            type : [Schema.Types.ObjectId],
            ref: "seller_table_data"
        }
});

buyerschema.pre("save",function(next){
    var salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)

    next()
})

buyerschema.methods.compairHashpass = async function(password){
    return await bcrypt.compare(password , this.password)
}

const busyer_user = mongoose.model("buyer_user_model",buyerschema)

module.exports = busyer_user;