import productService from '../services/Products.service.js'
import cartService from '../services/Carts.service.js'

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
            console.log(cart)
            res.render('cartById', { cart: cart, style: 'cart.css' })
        } catch (error) {
            console.log(error.message)
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
            console.log(error.message)
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
            console.log(user)
            res.render('home', { results, user })
        } catch (error) {
            console.log(error.message)
            res.render('404', { error })
        }
    }
}

export default new viewsController()
