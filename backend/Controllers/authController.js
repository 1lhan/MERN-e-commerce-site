const express = require('express')
const router = express.Router()
const User = require('../Models/userModel')
const bcrypt = require('bcrypt')

router.post('/register', (req, res) => {
    const { name, lastname, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        const user = new User({ name, lastname, email, password: hash, accType: 'user', cart: [], favorites: [], addresses: [] })

        User.findOne({ email })
            .then(email => {
                if (email) {
                    return res.json('Email has already been using')
                }
                else {
                    user.save().then().catch(err => console.log(err))
                    return res.json('Register successful')
                }
            })
            .catch(err => console.log(err))
    })
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(checkEmail => {
            if (checkEmail) {
                bcrypt.compare(password, checkEmail.password).then(result => {
                    if (result === true) {
                        return res.json({ msg: 'ok', user: checkEmail })
                    }
                    else {
                        return res.json({ msg: 'Email or password wrong' })
                    }
                }).catch()
            }
            else {
                return res.json({ msg: 'Email not exist' })
            }
        })
        .catch(err => console.log(err))
})

router.get('/sessionLogin/:userId', (req, res) => {
    User.findById(req.params.userId)
        .then(user => res.json(user))
        .catch(err => console.log(err))
})

module.exports = router

/*
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(checkEmail => {
            if (checkEmail) {
                User.findOne({ email, password })
                    .then(user => {
                        if (user) {
                            return res.json({ msg: 'ok', user })
                        }
                        else {
                            return res.json({ msg: 'Email or password wrong' })
                        }
                    })
                    .catch(err => console.log(err))
            }
            else {
                return res.json({ msg: 'Email not exist' })
            }
        })
        .catch(err => console.log(err))
})
*/