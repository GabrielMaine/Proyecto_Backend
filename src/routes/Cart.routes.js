'use strict'
import cartController from '../Controllers/Cart.controller.js'
import { Router } from 'express'

const router = Router()

router.post('/', cartController.createCart)

router.get('/:cid', cartController.getCart)

router.put('/:cid', cartController.paginateCart)

router.delete('/:cid', cartController.emptyCart)

router.post('/:cid/product/:pid', cartController.addProduct)

router.put('/:cid/product/:pid', cartController.updateProduct)

router.delete('/:cid/product/:pid', cartController.deleteProduct)

router.get('/:cid/purchase', cartController.buyCart)

export { router }
