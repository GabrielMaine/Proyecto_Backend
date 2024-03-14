'use strict'

import { Router } from 'express'
import viewsController from '../Controllers/Views.controller.js'
import { authorizeUser } from '../middleware/authorization.middleware.js'
import MailingService from '../services/mailing/mailing.js'

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

router.get('/mailTest', async (req, res) => {
    try {
        const mailer = new MailingService()
        const sendMailer = await mailer.sendMailUser({
            from: 'gabrielmaine14@gmail.com',
            to: 'gabrielmaine14@gmail.com',
            subject: 'PruebaMail',
            html: 'Email enviado con exito',
        })
        res.send({ status: 'success', message: 'Email enviado con exito' })
    } catch (error) {
        console.log(error.message)
        res.render('404', { error })
    }
})

router.get('/forgotPassword', viewsController.forgotPassword)

router.get('/resetPassword', viewsController.resetPassword)

router.get('/purchase/:cid', viewsController.purchase)

export { router }
