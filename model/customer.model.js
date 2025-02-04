/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for billing address
const addressSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    street: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'US',
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    },
    default: {
        type: Boolean,
        required: false,
        default: false,
    },
});

//create schema
const CustomerSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
        job_title: {
            type: String,
            required: false,
        },
        billing_address: {
            type: [addressSchema],
        },
        shipping_address: {
            type: [addressSchema],
        },
        company: {
            type: String,
            required: false,
        },
        profile_image: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        tier: {
            type: Schema.Types.ObjectId,
            ref: 'Tier',
            required: false,
        },
        wishlist: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }],
        saved_later: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }],
        weekly_product_subscription: {
            type: [{
                product: { type: Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number, default: 1 },
            }],
            required: false,
        },
        monthly_product_subscription: {
            type: [{
                product: { type: Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number, default: 1 },
            }],
            required: false,
        },
        fortyfive_days_product_subscription: {
            type: [{
                product: { type: Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number, default: 1 },
            }],
            required: false,
        },
        resetPasswordToken: {
            type: String,
            required: false,
        },
        resetPasswordExpires: {
            type: Date,
            required: false,
        }
        // createdFrom : {
        //     type : String,
        //     required : true,
        //     default : 'self',
        //     enum : ['netsuite', 'admin_pannel', 'self']
        // },
        // isActive : {
        //     type : Boolean,
        //     required : true,
        //     default : false
        // }
    },
    {
        timestamps: true,
    }
);

CustomerSchema.index({ firstname: 'text', lastname: 'text', email: 'text', company: 'text' });

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
