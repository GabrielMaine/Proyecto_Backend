'use strict'
import cartController from '../Controllers/Cart.controller.js'
import { Router } from 'express'

const router = Router()

router.post('/', cartController.createCart)

router.get('/:cid', cartController.getCart)

router.post('/:cid/product/:pid', cartController.addProduct)

router.delete('/:cid', cartController.emptyCart)

router.delete('/:cid/product/:pid', cartController.deleteProduct)

router.put('/:cid/product/:pid', cartController.updateProduct)

router.put('/:cid', cartController.paginateCart)

export { router }
