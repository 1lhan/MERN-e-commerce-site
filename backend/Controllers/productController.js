const express = require('express');
const router = express.Router()
const Product = require('../Models/productModel')
const Order = require('../Models/orderModel')

router.post('/add-product', (req, res) => {
    const { title, price, formValues, tags } = req.body;
    const product = new Product({ title, price, informations: formValues, tags, date: new Date(), soldAmount: 0 })
    product.save()
        .then(() => { console.log('product created') })
        .then(() => res.end(''))
        .catch(err => console.log(err))
})

router.post('/delete-product', (req, res) => {
    Product.findByIdAndRemove(req.body.productId)
        .then(() => console.log('product deleted'))
        .then(() => res.end(''))
        .catch(err => console.log(err))
})

router.post('/update-product', (req, res) => {
    const { productId, formValues } = req.body;

    Product.findByIdAndUpdate(productId, {
        $set: {
            title: formValues.title,
            price: formValues.price,
            tags: formValues.tags,
            informations: formValues.informations
        }
    })
        .then(() => console.log('product updated'))
        .then(() => res.end(''))
        .catch(err => console.log(err))
})

router.get('/product/:productId', (req, res) => {
    Product.findById(req.params.productId)
        .select('title price informations')
        .then(product => {
            if (product) {
                return res.json({ product, boolen: true })
            }
            else {
                return res.json({ boolen: false })
            }
        })
        //.then(() => res.end(''))
        .catch(err => {
            //console.log(err)
            return res.json({ boolen: false })
        })
})

router.get('/category/:categoryName', (req, res) => {
    Product.find({ 'informations.type': req.params.categoryName })
        .then(category => {
            let filters = []
            let objectsArr = []
            let keys = []

            for (let i in category) {
                for (let j in category[i].informations) {
                    if (Object.keys(category[i].informations[j])[0] !== 'type') {
                        objectsArr.push(category[i].informations[j])
                        keys.push(Object.keys(category[i].informations[j])[0])
                    }
                }
            }
            keys = [...new Set(keys)]
            for (let i in keys) {
                filters.push({ name: keys[i], arr: [] })
            }
            for (let i in filters) {
                for (let j in objectsArr) {
                    if (filters[i].name === Object.keys(objectsArr[j])[0]) {
                        filters[i].arr.push(Object.values(objectsArr[j])[0])
                    }
                }
            }
            return filters
        })
        .then(filters => {
            let sort = req.query['sort'] === undefined ?
                { value: '', boolen: false } : { value: req.query.sort, boolen: false }
            delete req.query.sort
            let { values, keys } = []
            values = Object.values(req.query)
            keys = Object.keys(req.query)
            let query = req.query
            let filterValues = []

            for (let i in keys) {
                if (keys[i] !== 'sort') {
                    if (query[keys[i]].includes('-')) {
                        let x = { $in: query[keys[i]].split('-') }
                        let y = `informations.${keys[i]}`
                        query[y] = x
                        for (let n in x.$in) {
                            filterValues.push(x.$in[n])
                        }
                        delete query[keys[i]]
                    }
                    else {
                        let x = values[i]
                        let y = `informations.${keys[i]}`
                        query[y] = x
                        filterValues.push(query[keys[i]])
                        delete query[keys[i]]
                    }
                }
            }

            if (sort.value === 'highToLow') {
                sort.value = { 'price': -1 }
                sort.boolen = true
                filterValues.push('highToLow')
            }
            else if (sort.value === 'lowToHigh') {
                sort.value = { 'price': 1 }
                sort.boolen = true
                filterValues.push('lowToHigh')
            }
            else if (sort.value === 'newest') {
                sort.value = { 'date': -1 }
                sort.boolen = true
                filterValues.push('newest')
            }
            else if (sort.value === 'sort') {
                sort.value = {}
                sort.boolen = false
            }


            for (let i in filters) {
                filters[i].arr = [...new Set(filters[i].arr)]
            }

            query['informations.type'] = req.params.categoryName

            let a = Product.find(query).sort(sort.value);
            let b = a.exec()
            b.then(products => res.json({ products, filters, filterValues }))
        })
        .catch(err => console.log(err))
})

router.get('/admin-products', (req, res) => {
    const page = req.query.page === undefined ? 1 : req.query.page;
    const productPerPage = 16;

    Product.find()
        .then(products => {
            const pageLength = Math.ceil(products.length / productPerPage)
            const productArr = products.slice((page - 1) * productPerPage, page * productPerPage)
            return res.json({ products: productArr, pageLength })
        })
        //.then(() => res.end(''))
        .catch(err => console.log(err))
})

router.get('/products-for-homepage', (req, res) => {
    Product.find().sort({ soldAmount: -1 }).limit(8)
        .then(mostSoldProducts => {
            return mostSoldProducts
        })
        .then(mostSoldProducts => {
            Product.find().sort({ date: -1 }).limit(8)
                .then(mostNewProducts => {
                    return res.json({ mostSoldProducts, mostNewProducts })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

router.get('/admin-orders', (req, res) => {
    Order.find().then(orders => res.json(orders)).catch(err => console.log(err))
})

module.exports = router;