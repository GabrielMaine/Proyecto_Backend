'use strict'
import productController from '../Controllers/Product.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', productController.paginateProducts)

router.post('/', productController.createProduct)

router.get('/:pid', productController.getProduct)

router.put('/:pid', productController.updateProduct)

router.delete('/:pid', productController.deleteProduct)

export { router }
