'use strict'

import {
    addProductToCart,
    cartCreator,
    cartGetterById,
    emptyCart,
    deleteProductFromCart,
    updateProductFromCart,
    updatePaginatedCart,
} from '../CartController.js'
import { Router } from 'express'

const router = Router()

//Rutas de los carritos

router.post('/', cartCreator)

router.get('/:cid', cartGetterById)

router.post('/:cid/product/:pid', addProductToCart)

router.delete('/:cid', emptyCart)

router.delete('/:cid/product/:pid', deleteProductFromCart)

router.put('/:cid/product/:pid', updateProductFromCart)

router.put('/:cid', updatePaginatedCart)

export { router }
