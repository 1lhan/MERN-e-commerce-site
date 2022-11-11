const mongoose = require('mongoose')

const orderModel = mongoose.Schema({
    cartInformations: {
        type: Object,
        required: true
    },
    addressInformations: {
        type: Object,
        required: true
    },
    cartTotalPrice: {
        type: Number,
        required: true
    },
    installmentNumber: {
        type: Number,
        required: true
    },
    cart: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = mongoose.model('Order', orderModel)