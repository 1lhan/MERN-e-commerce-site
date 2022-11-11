const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(cors());
app.use(express.json());

// Controllers
const productController = require('./Controllers/productController');
const authController = require('./Controllers/authController')
const userController = require('./Controllers/userController')

app.use(productController)
app.use(authController)
app.use(userController)

app.listen(5000, () => {
    console.log('Server running')
})

mongoose.connect(process.env.MONGODB_CONNECTION)
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.log(err))

/*
const session = require('express-session')
const Redis = require("ioredis")
const connectRedis = require("connect-redis")

const RedisStore = connectRedis(session)
const redis = new Redis()

app.use(session({
    name: "sessid",
    store: new RedisStore({
        client: redis,
        disableTouch: true
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false
    },
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false
}))*/