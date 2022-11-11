const mongoose = require('mongoose')

const productModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    piece: {
        type: Number,
        required: false
    },
    informations: {
        type: Array,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    soldAmount: {
        type: Number,
        required: false
    }
})

module.exports = mongoose.model('Product', productModel)