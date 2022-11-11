const express = require('express')
const router = express.Router()
const User = require('../Models/userModel')
const Product = require('../Models/productModel')
const Order = require('../Models/orderModel')
const bcrypt = require('bcrypt')

router.get('/get-user/:userId', (req, res) => {
    User.findById(req.params.userId)
        .then(user => res.json(user))
        .then(() => res.end(''))
        .catch(err => console.log(err))
})

router.post('/update-profile', (req, res) => {
    const { userId, name, lastname, email } = req.body;
    User.findByIdAndUpdate(userId, {
        $set: { name, lastname, email }
    })
        .then(console.log('user updated')).then(() => res.end('')).catch(err => console.log(err))
})

router.post('/update-password', (req, res) => {
    const { userId, oldPassword, password } = req.body;
    User.findOne({ _id: userId })
        .then(user => {
            bcrypt.compare(oldPassword, user.password).then(result => {
                if (result === true) {
                    bcrypt.hash(password, 10, (err, hash) => {
                        User.findByIdAndUpdate(userId, {
                            $set: { password: hash }
                        }).then(() => console.log('password update ok')).catch(err => console.log(err))
                    })
                }
                else {
                    res.json('Password wrong')
                }
            })
        }).catch(err => console.log(err))
})

router.get('/get-favorites-and-cart/:userId', (req, res) => {
    User.findById(req.params.userId)
        .select('favorites cart')
        .populate('favorites.productId', 'title price')
        .then(user => res.json(user))
        .then(() => res.end(''))
        .catch(err => console.log(err))
})

router.post('/favorites', (req, res) => {
    const { userId, productId } = req.body;

    User.findOne({ _id: userId, favorites: { $elemMatch: { productId } } })
        .then(favorite => {
            if (favorite === null) {
                User.findByIdAndUpdate(userId, {
                    $push: { favorites: { productId } }
                }).then(() => res.json(true)).then(() => res.end('')).catch(err => console.log(err))
            }
            else {
                User.findByIdAndUpdate(userId, {
                    $pull: { favorites: { productId } }
                }).then(() => res.json(false)).then(() => res.end('')).catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
})

router.post('/add-to-cart', (req, res) => {
    const { userId, productId } = req.body;

    User.findOne({ _id: userId, cart: { $elemMatch: { productId } } })
        .then(product => {
            if (product === null) {
                User.findByIdAndUpdate(userId, {
                    $push: { cart: { productId, quantity: 1 } }
                }).then(() => res.end('')).catch(err => console.log(err))
            }
            else {
                let newQuantity;
                User.findById(userId)
                    .then(user => {
                        for (let i in user.cart) {
                            if (String(user.cart[i].productId) === String(productId)) {
                                newQuantity = user.cart[i].quantity + 1
                                break
                            }
                        }
                        User.findOneAndUpdate({ _id: userId, cart: { $elemMatch: { productId } } }, {
                            $set: { 'cart.$.quantity': newQuantity }
                        }).then(() => console.log('add to cart ok')).then(() => res.end('')).catch(err => console.log(err))
                    })
            }
        })
})

router.get('/get-cart/:userId', (req, res) => {
    User.findById(req.params.userId)
        .populate('cart.productId', 'title price')
        .then(user => res.json(user.cart))
        .then(() => res.end(''))
        .catch(err => console.log(err))
})

router.post('/cart-quantity', (req, res) => {
    const { userId, productId, quantityAction } = req.body;
    User.findById(userId)
        .then(user => {
            let quantity;
            for (let i in user.cart) {
                if (String(user.cart[i].productId) === String(productId)) {
                    quantity = Number(user.cart[i].quantity);
                    break
                }
            }
            return quantity
        })
        .then(quantity => {
            User.findOneAndUpdate({ _id: userId, cart: { $elemMatch: { productId } } }, {
                $set: { 'cart.$.quantity': quantityAction === 'increase' ? Number(quantity + 1) : Number(quantity - 1) }
            })
                .then(() => console.log('cart quantity ok')).then(() => res.end('')).catch(err => console.log(err))
        })
})

router.post('/delete-product-from-cart', (req, res) => {
    const { userId, productId } = req.body;
    User.findByIdAndUpdate(userId, {
        $pull: { cart: { productId } }
    })
        .then(() => console.log('product deleted from cart'))
        .then(() => res.end(''))
        .catch(err => console.log(err))
})

router.post('/add-address', (req, res) => {
    const { userId, addressTitle, address } = req.body;
    User.findByIdAndUpdate(userId, {
        $push: { addresses: { addressTitle, address } }
    })
        .then(() => console.log('address added'))
        .then(() => res.end(''))
        .catch(err => console.log(err))
})

router.get('/get-addresses/:userId', (req, res) => {
    User.findById(req.params.userId)
        .then(user => res.json(user.addresses))
        .then(() => res.end(''))
        .catch(err => console.log(err))
})

router.post('/delete-address', (req, res) => {
    const { userId, addressId } = req.body;
    User.findByIdAndUpdate(userId, {
        $pull: { addresses: { _id: addressId } }
    })
        .then(() => console.log('address deleted'))
        .then(() => res.end(''))
        .catch(err => console.log(err))
})

router.post('/update-address', (req, res) => {
    const { userId, addressId, editAddressTitle, editAddress } = req.body;
    User.findOneAndUpdate({ _id: userId, addresses: { $elemMatch: { _id: addressId } } }, {
        $set: { 'addresses.$.addressTitle': editAddressTitle, 'addresses.$.address': editAddress }
    })
        .then(() => console.log('address updated'))
        .then(() => res.end(''))
        .catch(err => console.log(err))
})

router.get('/get-orders/:userId', (req, res) => {
    User.findById(req.params.userId)
        .populate('orders.orderId')
        .then(user => res.json(user.orders))
        .catch(err => console.log(err))
})

router.post('/add-order/:userId', (req, res) => {
    const userId = req.params.userId
    const dateObj = new Date()
    const date = (dateObj.getDate() + '.' + Number(dateObj.getMonth() + 1) + '.' + dateObj.getFullYear())
    const { cartNumber, cartExpDate, cartCvv, cartName, addressTitle, address, cartTotalPrice, installmentNumber, cart } = req.body;
    const order = new Order({
        cartInformations: { cartNumber, cartExpDate, cartCvv, cartName },
        addressInformations: { addressTitle, address }, cartTotalPrice, installmentNumber, cart, date, status: 'preparing', userId
    })
    order.save()
        .then(order => {
            User.findByIdAndUpdate(userId, {
                $push: { orders: { orderId: order._id } }
            }).then(() => console.log('orderId > user ok')).catch(err => console.log(err))
            return order
        })
        .then(order => {
            for (let i in order.cart) {
                Product.findById(order.cart[i].productId)
                    .then(orderObj => {
                        Product.findByIdAndUpdate(order.cart[i].productId, {
                            $set: { soldAmount: orderObj.soldAmount + 1 }
                        }).then(() => console.log('soldAmount ok')).catch(err => console.log(err))
                    }).catch(err => console.log(err))
            }
        })
        .then(() => {
            User.findByIdAndUpdate(userId, {
                $set: { cart: [] }
            }).then(() => console.log('cart clear ok')).catch(err => console.log(err))
        })
})

router.post('/admin-update-order', (req, res) => {
    const { orderId, status } = req.body
    Order.findByIdAndUpdate(orderId, {
        $set: { status }
    }).then(() => console.log('update order ok')).catch(err => console.log(err))
})

module.exports = router

/*
router.post('/update-password', (req, res) => {
    const { userId, oldPassword, password } = req.body;
    User.findOne({ _id: userId, password: oldPassword })
        .then(user => {
            if (user) {
                User.findByIdAndUpdate(userId, {
                    $set: { password }
                })
                    .then(console.log('user updated')).catch(err => console.log(err))
                return res.json(true)
            }
            else {
                res.json('Password wrong')
            }
        })
        .catch(err => console.log(err))
})
*/