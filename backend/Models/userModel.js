const mongoose = require('mongoose')

const userModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accType: {
        type: String,
        required: true
    },
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    favorites: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ],
    addresses: [
        {
            addressTitle: {
                type: String
            },
            address: {
                type: String
            }
        }
    ],
    orders: [
        {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Order'
            }
        }
    ]
})

module.exports = mongoose.model('User', userModel)