'use strict'
import cartsRepository from '../repositories/carts.repository.js'
import productsRepository from '../repositories/products.repository.js'
import ticketsRepository from '../repositories/tickets.repository.js'
import usersRepository from '../repositories/users.repository.js'
import { v4 as uuidv4 } from 'uuid'

class cartController {
    async createCart(req, res) {
        try {
            const response = await cartsRepository.create()
            res.status(201).json({
                cart: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async getCart(req, res) {
        try {
            let cId = req.params.cid
            let response = await cartsRepository.populate(cId)
            res.status(201).json({
                cart: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
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
            let product = await productsRepository.getById(pId)
            let cart = await cartsRepository.getById(cId)
            let user = (await usersRepository.getByCart(cId)) || {}

            if (user.role === 'premium' && user.email === product.owner) {
                throw new Error('Premium users cant add products that they own to their cart')
            }

            let response = []
            const cartIndex = cart.products.findIndex(el => el.product == pId)

            if (cartIndex === -1) {
                cart.products.push({ product: product._id || product.id, quantity: 1 })
                response = await cartsRepository.update(cId, cart)
            } else {
                cart.products[cartIndex].quantity++
                response = await cartsRepository.update(cId, cart)
            }
            res.status(201).json({
                cart: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async emptyCart(req, res) {
        try {
            let cId = req.params.cid
            let response = await cartsRepository.update(cId, { products: [] })
            res.status(201).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
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
            let cart = await cartsRepository.getById(cId)
            const cartIndex = cart.products.findIndex(el => el.product == pId)
            let match = true
            let response = cart
            if (cartIndex === -1) {
                match = false
            } else {
                cart.products.splice(cartIndex, 1)
                response = await cartsRepository.update(cId, cart)
            }
            res.status(match ? 200 : 204).json({
                cart: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
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
            let cart = await cartsRepository.getById(cId)
            //const cartIndex = cart.products.findIndex(el => el.product == product.id)
            const cartIndex = cart.products.findIndex(el => el.product == pId)
            let match = true
            let response = cart
            if (cartIndex === -1) {
                match = false
            } else {
                cart.products[cartIndex].quantity = updatedQuantity.quantity
                response = await cartsRepository.update(cId, cart)
            }
            res.status(match ? 200 : 204).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async paginateCart(req, res) {
        try {
            let cId = req.params.cid
            let products = req.body.payload
            let response = await cartsRepository.update(cId, products)

            res.status(200).json({
                cart: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async buyCart(req, res) {
        try {
            let cId = req.params.cid
            let cart = await cartsRepository.getById(cId)
            let user = await usersRepository.getByCart(cId)
            let products = await productsRepository.getAll()

            //Verificar items a comprar y actualizamos stock
            const boughtItems = cart.products
                .map(p => {
                    const existingProduct = products.find(e => e._id.equals(p.product))

                    if (existingProduct && existingProduct.stock >= p.quantity) {
                        existingProduct.stock -= p.quantity
                        productsRepository.update(existingProduct._id, existingProduct)
                        return {
                            _id: p.product,
                            quantity: p.quantity,
                            price: existingProduct.price,
                        }
                    }

                    return null
                })
                .filter(item => item !== null)

            //Vaciar el carrito y calcular el total de compra
            const amount = boughtItems.reduce((total, product) => total + product.quantity * product.price, 0)

            cart.products = cart.products.filter(
                item => !boughtItems.some(boughtItem => boughtItem._id.equals(item.product))
            )
            cart = await cartsRepository.update(cId, cart)

            //Crear el ticket

            let ticketData = {
                purchase_datetime: Date(),
                purchaser: user.email,
                code: uuidv4(),
                amount: amount,
            }

            let ticket = await ticketsRepository.create(ticketData)

            res.status(200).json({
                status: 'Success',
                payload: {
                    ticket,
                    cart,
                },
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }
}

export default new cartController()
