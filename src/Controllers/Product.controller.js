'use strict'
import productsRepository from '../repositories/products.repository.js'
import usersRepository from '../repositories/users.repository.js'
import MailingService from '../services/mailing/mailing.js'

class productController {
    async createProduct(req, res) {
        try {
            let data = req.body
            let user = req.session.user || {}
            if (!data.title || !data.description || !data.code || !data.stock || !data.price || !data.category) {
                throw new Error('Key error: missing values')
            }
            if (data.stock < 0 || data.price < 0) {
                throw new Error('Key error: stock and price can not be negative')
            }
            data.owner = user.role === 'premium' ? user.email : 'admin'
            const response = await productsRepository.create(data)
            res.status(201).json({
                payload: response,
                status: 'Success',
            })
        } catch (error) {
            if (error.message.includes('duplicate key error collection')) error.message = 'Key error: duplicated code'
            if (error.message.includes('Key error')) {
                res.status(400).json({
                    status: 'Fail',
                    error: error.message,
                })
            } else {
                req.logger.error(`${error.cause || error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
                res.status(500).json({
                    status: 'Fail',
                    error: error.cause || error.message,
                })
            }
        }
    }

    async getProduct(req, res) {
        try {
            let pId = req.params.pid
            const response = await productsRepository.getById(pId)
            if (!response)
                throw new Error(`Cast to ObjectId failed for value ${pId} (type string) at path _id for model products`)
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

    async paginateProducts(req, res) {
        try {
            let limit = req.query.limit || 10
            let page = req.query.page || 1
            let sort = req.query.sort || ''
            let status = req.query.status || ''
            let category = req.query.category || ''

            const options = {
                page: page,
                limit: limit,
            }
            if (sort === '1' || sort === '-1') {
                sort = parseInt(sort)
            }
            if (sort === 1 || sort === -1 || sort === 'asc' || sort === 'desc') {
                options.sort = { price: sort }
            }

            const queries = {}
            if (status !== '') {
                queries.status = status
            }
            if (category !== '') {
                queries.category = category
            }

            // let products = await productService.paginateProducts(queries, options)
            let products = await productsRepository.paginate(queries, options)

            const response = {
                status: products.docs.length > 0 ? 'success' : 'error',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage
                    ? `http://localhost:8080/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&status=${status}&category=${category}`
                    : null,
                nextLink: products.hasNextPage
                    ? `http://localhost:8080/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&status=${status}&category=${category}`
                    : null,
            }

            res.status(200).json({
                status: 'Success',
                payload: response,
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(500).json({
                status: 'Fail',
                error: error.message,
            })
        }
    }

    async updateProduct(req, res) {
        try {
            let pId = req.params.pid
            let data = req.body
            if (data.stock < 0 || data.price < 0) {
                throw new Error('Key error: stock and price can not be negative')
            }
            const response = await productsRepository.update(pId, data)
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
                if (error.message.includes('Key error')) {
                    res.status(400).json({
                        status: 'Fail',
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
            let pId = req.params.pid
            let user = req.session.user || {} //Usuario que quiere borrar el producto
            let product = await productsRepository.getById(pId)
            if (user.role === 'premium') {
                if (user.email !== product.owner) throw new Error('Premium users can only delete their products')
            }
            let owner = (await usersRepository.getByEmail(product.owner)) || {} //Dueño del producto
            if (owner.role === 'premium') {
                // Enviamos el mail
                const mailer = new MailingService()
                mailer.sendMailUser({
                    from: 'pruebaCurso@gmail.com',
                    to: owner.email,
                    subject: 'Producto eliminado',
                    html: `<p>Su producto ${product.title} ha sido eliminado.</p>`,
                })
            }
            const response = await productsRepository.delete(pId)
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
}

export default new productController()
