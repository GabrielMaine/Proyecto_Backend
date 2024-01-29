'use strict'

import { Router } from 'express'
import viewsController from '../Controllers/Views.controller.js'
import { authorizeUser } from '../middleware/authorization.middleware.js'

const router = Router()

router.get('/products', viewsController.products)

router.get('/realtimeproducts', viewsController.realTimeProducts)

router.get('/chat', authorizeUser, viewsController.chat)

router.get('/carts/:cid', viewsController.idCarts)

router.get('/register', viewsController.register)

router.get('/login', viewsController.login)

router.get('/profile', viewsController.profile)

router.get('/', viewsController.root)

router.get('/mockingproducts', viewsController.mockingProducts)

router.get('/loggerTest', viewsController.loggerTest)

export { router }
