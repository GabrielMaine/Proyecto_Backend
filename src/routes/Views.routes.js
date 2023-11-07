'use strict'

import { Router } from 'express'
import { productModel } from '../dao/models/Products.model.js'

const router = Router()

//Rutas del catalogo

router.get('/', async (req, res) => {
    let products = await productModel.find({}).lean()
    res.render('home', { products })
})

router.get('/realtimeproducts', async (req, res) => {
    let products = await productModel.find({}).lean()
    res.render('realTimeProducts', { products })
})

router.get('/chat', (req, res) => {
    res.render('chat')
})

export { router }
