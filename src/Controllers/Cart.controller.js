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
                payload: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(500).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async getCart(req, res) {
        try {
            let cId = req.params.cid
            let response = await cartsRepository.populate(cId)
            if (!response)
                throw new Error(`Cast to ObjectId failed for value ${cId} (type string) at path _id for model carts`)
            res.status(200).json({
                status: 'Success',
                payload: response,
            })
        } catch (error) {
            if (error.message.includes('Cast to ObjectId failed')) {
                res.status(404).json({
                    status: 'Not found',
                    error: error.message,
                })
            } else {
                req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
                res.status(500).json({
                    status: 'Fail',
                    error: error.message,
                })
            }
        }
    }

    async paginateCart(req, res) {
        try {
            let cId = req.params.cid
            let products = req.body.payload
            let response = await cartsRepository.update(cId, products)

            res.status(200).json({
                status: 'Success',
                payload: response,
            })
        } catch (error) {
            if (error.message.includes('Cast to ObjectId failed')) {
                res.status(404).json({
                    status: 'Not found',
                    error: error.message,
                })
            } else {
                req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
                res.status(500).json({
                    status: 'Fail',
                    error: error.message,
                })
            }
        }
    }

    async emptyCart(req, res) {
        try {
            let cId = req.params.cid
            let response = await cartsRepository.update(cId, { products: [] })
            res.status(200).json({
                status: 'Success',
                payload: response,
            })
        } catch (error) {
            if (error.message.includes('Cast to ObjectId failed')) {
                res.status(404).json({
                    status: 'Not found',
                    error: error.message,
                })
            } else {
                req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
                res.status(500).json({
                    status: 'Fail',
                    error: error.message,
                })
            }
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
            res.status(200).json({
                payload: response,
                status: 'Success',
            })
        } catch (error) {
            if (error.message.includes('Cast to ObjectId failed')) {
                res.status(404).json({
                    status: 'Not found',
                    error: error.message,
                })
            } else {
                if (error.message.includes('Premium users can only delete their products')) {
                    res.status(401).json({
                        status: 'Not authorized',
                        error: error.message,
                    })
                } else {
                    req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
                    res.status(500).json({
                        status: 'Fail',
                        error: error.message,
                    })
                }
            }
        }
    }

    async updateProduct(req, res) {
        try {
            let cId = req.params.cid
            let pId = req.params.pid
            let updatedQuantity = req.body
            let product = await productsRepository.getById(pId)
            let cart = await cartsRepository.getById(cId)
            let user = (await usersRepository.getByCart(cId)) || {}

            if (user.role === 'premium' && user.email === product.owner) {
                throw new Error('Premium users cant add products that they own to their cart')
            }
            const cartIndex = cart.products.findIndex(el => el.product == pId)
            let response = cart
            if (cartIndex === -1) {
                throw new Error('Cast to ObjectId failed: product not found in cart')
            } else {
                cart.products[cartIndex].quantity = updatedQuantity.quantity
                response = await cartsRepository.update(cId, cart)
            }
            res.status(200).json({
                payload: response,
                status: 'Success',
            })
        } catch (error) {
            if (error.message.includes('Cast to ObjectId failed')) {
                res.status(404).json({
                    status: 'Not found',
                    error: error.message,
                })
            } else {
                if (error.message.includes('Premium users cant add products that they own to their cart')) {
                    res.status(401).json({
                        status: 'Not authorized',
                        error: error.message,
                    })
                } else {
                    req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
                    res.status(500).json({
                        status: 'Fail',
                        error: error.message,
                    })
                }
            }
        }
    }

    async deleteProduct(req, res) {
        try {
            let cId = req.params.cid
            let pId = req.params.pid
            let cart = await cartsRepository.getById(cId)
            const cartIndex = cart.products.findIndex(el => el.product == pId)
            let response = cart
            if (cartIndex === -1) {
                throw new Error('Cast to ObjectId failed: product not found in cart')
            } else {
                cart.products.splice(cartIndex, 1)
                response = await cartsRepository.update(cId, cart)
            }
            res.status(200).json({
                payload: response,
                status: 'Success',
            })
        } catch (error) {
            if (error.message.includes('Cast to ObjectId failed')) {
                res.status(404).json({
                    status: 'Not found',
                    error: error.message,
                })
            } else {
                req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
                res.status(500).json({
                    status: 'Fail',
                    error: error.message,
                })
            }
        }
    }

    async buyCart(req, res) {
        try {
            let cId = req.params.cid
            let cart = await cartsRepository.getById(cId)
            let user = (await usersRepository.getByCart(cId)) || { email: 'admin@admin.com' }
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
                            title: existingProduct.title,
                            price: existingProduct.price,
                        }
                    }

                    return null
                })
                .filter(item => item !== null)

            //Vaciar el carrito y calcular el total de compra
            const amount = boughtItems.reduce((total, product) => total + product.quantity * product.price, 0)

            if (amount === 0) {
                throw new Error('Purchase error: can not purchase zero products')
            }

            cart.products = cart.products.filter(
                item => !boughtItems.some(boughtItem => boughtItem._id.equals(item.product))
            )
            cart = await cartsRepository.update(cId, cart)
            cart = await cartsRepository.populate(cId)

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
                    boughtItems,
                    cart,
                },
            })
        } catch (error) {
            if (error.message.includes('Purchase error:')) {
                res.status(400).json({
                    status: 'Error',
                    error: error.message,
                })
            } else {
                if (error.message.includes('Cast to ObjectId failed')) {
                    res.status(404).json({
                        status: 'Not found',
                        error: error.message,
                    })
                } else {
                    req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
                    res.status(500).json({
                        status: 'Fail',
                        error: error.message,
                    })
                }
            }
        }
    }

    async deleteUnusedCarts(req, res) {
        try {
            let carts = await cartsRepository.getAll()
            let unusedCarts = []

            for (const cart of carts) {
                const user = await usersRepository.getByCart(cart._id)
                // Lógica para determinar si el carrito está en uso o no
                if (!user) {
                    unusedCarts.push(cart._id)
                    await cartsRepository.delete(cart._id)
                }
            }
            res.status(200).json({
                status: 'success',
                payload: unusedCarts,
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(500).json({
                status: 'Fail',
                error: error.message,
            })
        }
    }
}

export default new cartController()
