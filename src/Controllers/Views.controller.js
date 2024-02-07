import productService from '../services/Products.service.js'
import cartService from '../services/Carts.service.js'
import productsRepository from '../repositories/products.repository.js'
import cartsRepository from '../repositories/carts.repository.js'
import { generateProduct } from '../helpers/generateProduct.js'
import usersRepository from '../repositories/users.repository.js'

class viewsController {
    async root(req, res) {
        let user = req.session.user
        if (user) {
            res.redirect('/profile')
        } else {
            res.redirect('/login')
        }
    }

    async profile(req, res) {
        let user = req.session.user
        if (user) {
            res.render('profile', { user: user, style: 'profile.css' })
        } else {
            res.redirect('/login')
        }
    }

    async login(req, res) {
        res.render('login', { style: 'login.css' })
    }

    async register(req, res) {
        res.render('register', { style: 'register.css' })
    }

    async idCarts(req, res) {
        try {
            let cId = req.params.cid
            let cart = await cartService.populateCart(cId)
            res.render('cartById', { cart: cart, style: 'cart.css' })
        } catch (error) {
            res.render('404', { error: error, style: '404.css' })
        }
    }

    async chat(req, res) {
        res.render('chat')
    }

    async realTimeProducts(req, res) {
        try {
            let products = await productService.getAllProducts()
            res.render('realTimeProducts', { products })
        } catch (error) {
            res.render('404', { error })
        }
    }

    async products(req, res) {
        try {
            let products = await productService.paginateProducts({}, { limit: 5, page: 1, lean: true })
            const results = {
                status: products.docs.length > 0 ? 'success' : 'error',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage
                    ? `http://localhost:8080/api/products?limit=${products.limit}&page=${products.prevPage}`
                    : null,
                nextLink: products.hasNextPage
                    ? `http://localhost:8080/api/products?limit=${products.limit}&page=${products.nextPage}`
                    : null,
            }
            let user = req.session.user
            res.render('home', { results, user })
        } catch (error) {
            res.render('404', { error })
        }
    }

    async mockingProducts(req, res) {
        try {
            let productArray = []
            for (let i = 0; i < 100; i++) {
                productArray.push(generateProduct())
            }
            res.send({ status: 'success', payload: productArray })
        } catch (error) {
            res.render('404', { error })
        }
    }

    async loggerTest(req, res) {
        try {
            req.logger.debug(`${req.method} en la siguiente URL: ${req.url} - ${new Date().toLocaleString()}`)
            req.logger.http(`${req.method} en la siguiente URL: ${req.url} - ${new Date().toLocaleString()}`)
            req.logger.info(`${req.method} en la siguiente URL: ${req.url} - ${new Date().toLocaleString()}`)
            req.logger.warning(`${req.method} en la siguiente URL: ${req.url} - ${new Date().toLocaleString()}`)
            req.logger.error(`${req.method} en la siguiente URL: ${req.url} - ${new Date().toLocaleString()}`)
            req.logger.fatal(`${req.method} en la siguiente URL: ${req.url} - ${new Date().toLocaleString()}`)
            res.send('Logger Test')
        } catch (error) {
            res.render('404', { error })
        }
    }

    async forgotPassword(req, res) {
        try {
            res.render('forgotPassword', { style: 'forgotPassword.css' })
        } catch (error) {
            res.render('404', { error })
        }
    }

    async resetPassword(req, res) {
        try {
            let { token } = req.query
            let user = await usersRepository.getByToken(token)
            //Verificamos la validez del codigo
            if (!user) {
                throw new Error('Codigo de validación invalido')
            }
            //Verificamos que no haya expirado
            let isExpired = false
            let isntExpired = true
            if (user.expiration < new Date()) {
                isExpired = true
                isntExpired = false
            }
            res.render('resetPassword', { user: user, isExpired: isExpired, isntExpired: isntExpired })
        } catch (error) {
            res.render('404', { error })
        }
    }
}

export default new viewsController()
