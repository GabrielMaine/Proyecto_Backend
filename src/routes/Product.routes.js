'use strict'
import productController from '../Controllers/Product.controller.js'
import { Router } from 'express'

const router = Router()

router.get('/', productController.paginateProducts)

router.get('/:pid', productController.getProduct)

router.post('', productController.createProduct)

router.put('/:pid', productController.updateProduct)

router.delete('/:pid', productController.deleteProduct)

export { router }
