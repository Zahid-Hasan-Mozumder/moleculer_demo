const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesOrderSchema = new Schema({
    id : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    }
});

const ItemFulfillmentSchema = new Schema({

    item_fulfillment_id : {
        type : String,
        required : true
    },
    sales_order_id : {
        type : Number,
        required : true
    },
    item_id : {
        type : String,
        required : true
    },
    already_fulfilled : {
        type : Number,
        required : true
    },
    in_process : {
        type : Number,
        required : true
    },
    original_quantity : {
        type : Number,
        required : true
    },
    remaining : {
        type : Number,
        required : true
    },
    status_type : {
        type : String,
        required : true
    },
    item_status : {
        type : String,
        required : true
    }

});

const SalesOrder = mongoose.model('SalesOrder', SalesOrderSchema);
const ItemFulfillment = mongoose.model('ItemFulfillment', ItemFulfillmentSchema);

module.exports = { SalesOrder,  ItemFulfillment };