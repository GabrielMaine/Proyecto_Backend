'use strict'

import { Router } from 'express'
import viewsController from '../Controllers/Views.controller.js'

const router = Router()

router.get('/products', viewsController.products)

router.get('/realtimeproducts', viewsController.realTimeProducts)

router.get('/chat', viewsController.chat)

router.get('/carts/:cid', viewsController.idCarts)

router.get('/register', viewsController.register)

router.get('/login', viewsController.login)

router.get('/profile', viewsController.profile)

router.get('/', viewsController.root)

export { router }
