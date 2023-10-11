'use strict'

import { Router } from 'express'
import { product } from '../helpers.js'

const router = Router()

//Rutas del catalogo

router.get('/', async (req, res) => {
    let products = await product.getProducts()
    res.render('home', { products })
})

router.get('/realtimeproducts', async (req, res) => {
    let products = await product.getProducts()
    res.render('realTimeProducts', { products })
})

export { router }
