const mongoose =  require('mongoose')
const geocoder = require('../utils/geocoder')
const Schema = mongoose.Schema;

const seller_table_data_schema = Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: "seller_user_table",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  scarpType : {
    type : String,
    required : true
  },
  postedDate: {
    type: Date,
  },
  orderStatus: {
    type: String,
    default: "active",
  },
  hno:{
            type : String,
            required : true
        },
        village : {
            type : String,
            required : true
        },
        street : {
            type : String,
            required : true
        },
        mandal : {
            type : String,
            required : true
        },
        district : {
            type : String,
            required : true
        },
        state : {
            type : String,
            required : true
        },
        pincode : {
            type : String,
            required : true
        },
        location: {
            type: {
                type: String,
            },
            coordinates: {
                type: [Number],
            },
            city: String,
        },
});

seller_table_data_schema.pre('save',async function(next){
    const address_data = `${this.hno},${this.village},${this.mandal},${this.district},${this.state},${this.pincode}`;
    
    const Getlocation = await geocoder.geocode(address_data);

    this.location = {
        type: "Point",
        coordinates: [Getlocation[0].longitude, Getlocation[0].latitude],
        city: Getlocation[0].city,
    };

    // console.log(this.location)
    next()
})

const seller_table_data = mongoose.model("seller_table_data", seller_table_data_schema);

module.exports = seller_table_data;