'use strict'

import { Router } from 'express'
import { productModel } from '../dao/models/Products.model.js'
import { cartModel } from '../dao/models/Carts.model.js'

const router = Router()

//Rutas del catalogo

router.get('/', async (req, res) => {
    try {
        let products = await productModel.paginate({}, { limit: 5, page: 1, lean: true })
        const results = {
            status: products.docs.length > 0 ? 'success' : 'error',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage
                ? `http://localhost:8080/api/products?limit=${products.limit}&page=${products.prevPage}`
                : null,
            nextLink: products.hasNextPage
                ? `http://localhost:8080/api/products?limit=${products.limit}&page=${products.nextPage}`
                : null,
        }
        res.render('home', { results })
    } catch (error) {
        console.log(error.message)
        res.render('404', { error })
    }
})

router.get('/realtimeproducts', async (req, res) => {
    try {
        let products = await productModel.find({}).lean()
        res.render('realTimeProducts', { products })
    } catch (error) {
        console.log(error.message)
        res.render('404', { error })
    }
})

router.get('/chat', (req, res) => {
    res.render('chat')
})

router.get('/carts/:cid', async (req, res) => {
    let cId = req.params.cid
    console.log(cId)
    try {
        let cart = await cartModel.findById(cId).populate('products.product').lean()
        console.log(cart)
        res.render('cartById', { cart })
    } catch (error) {
        console.log(error.message)
        res.render('404', { error })
    }
})

export { router }
