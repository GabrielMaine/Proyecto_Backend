'use strict'
import cartService from '../services/Carts.service.js'
import productService from '../services/Products.service.js'

class cartController {
    async createCart(req, res) {
        try {
            const response = await cartService.createCart()
            res.status(201).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async getCart(req, res) {
        try {
            let cid = req.params.cid
            let response = await cartService.populateCart(cid)
            res.status(201).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async addProduct(req, res) {
        try {
            let cId = req.params.cid
            let pId = req.params.pid
            let product = await productService.getProduct(pId)
            let cart = await cartService.findCart(cId)
            let response = []
            const cartIndex = cart.products.findIndex(el => el.product == product.id)

            if (cartIndex === -1) {
                cart.products.push({ product: product._id, quantity: 1 })
                //updatedCart = await cartModel.findByIdAndUpdate({ _id: cId }, cart, { new: true })
                response = await cartService.updateCart(cId, cart)
            } else {
                cart.products[cartIndex].quantity++
                // updatedCart = await cartModel.findByIdAndUpdate({ _id: cId }, cart, { new: true })
                response = await cartService.updateCart(cId, cart)
            }
            res.status(201).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async emptyCart(req, res) {
        try {
            let cId = req.params.cid
            let response = await cartService.updateCart(cId, { products: [] })
            res.status(201).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async deleteProduct(req, res) {
        try {
            let cId = req.params.cid
            let pId = req.params.pid
            let cart = await cartService.findCart(cId)
            //const cartIndex = cart.products.findIndex(el => el.product == product.id)
            const cartIndex = cart.products.findIndex(el => el.product == pId)
            let match = true
            let response = cart
            if (cartIndex === -1) {
                match = false
            } else {
                cart.products.splice(cartIndex, 1)
                response = await cartService.updateCart(cId, cart)
            }
            res.status(match ? 200 : 204).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async updateProduct(req, res) {
        try {
            let cId = req.params.cid
            let pId = req.params.pid
            let updatedQuantity = req.body
            let cart = await cartService.findCart(cId)
            //const cartIndex = cart.products.findIndex(el => el.product == product.id)
            const cartIndex = cart.products.findIndex(el => el.product == pId)
            let match = true
            let response = cart
            if (cartIndex === -1) {
                match = false
            } else {
                cart.products[cartIndex].quantity = updatedQuantity.quantity
                response = await cartService.updateCart(cId, cart)
            }
            res.status(match ? 200 : 204).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async paginateCart(req, res) {
        try {
            let cId = req.params.cid
            let cart = await cartService.populateCart(cId)
            let response = await cartService.updateCart(cId, cart)

            res.status(200).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }
}

export default new cartController()
