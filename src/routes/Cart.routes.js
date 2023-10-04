'use strict'

import { addProductToCart, cartCreator, cartGetterById } from '../CartController.js'
import { Router } from 'express'

const router = Router()

//Rutas de los carritos

router.post('/', cartCreator)

router.get('/:cid', cartGetterById)

router.post('/:cid/product/:pid', addProductToCart)

export { router }
