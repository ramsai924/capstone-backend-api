const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const accepted_orders_schema = Schema({

    soldDataId: {
        type: Schema.Types.ObjectId,
        ref: "seller_table_data",
    },
    sellerid: {
        type: Schema.Types.ObjectId,
        ref: "seller_user_table",
    },
    buyerid: {
        type: Schema.Types.ObjectId,
        ref: "buyer_user_model",
    }
})

const accepted_orders_table = mongoose.model("accepted_orders_table", accepted_orders_schema);

module.exports = accepted_orders_table;