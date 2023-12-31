'use strict'
import productService from '../services/Products.service.js'

class productController {
    async createProduct(req, res) {
        try {
            let data = req.body
            const response = await productService.createProduct(data)
            res.status(201).json({
                product: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async getProduct(req, res) {
        try {
            let pId = req.params.pid
            const response = await productService.getProduct(pId)
            res.status(200).json({
                product: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
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

            let products = await productService.paginateProducts(queries, options)

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
                    ? `http://localhost:8080/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&status=${status}`
                    : null,
                nextLink: products.hasNextPage
                    ? `http://localhost:8080/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&status=${status}`
                    : null,
            }

            res.status(200).json({
                payload: response,
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
            let pId = req.params.pid
            let data = req.body
            const response = await productService.updateProduct(pId, data)
            res.status(200).json({
                product: response,
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
            let pId = req.params.pid
            const response = await productService.deleteProduct(pId)
            res.status(200).json({
                product: response,
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

export default new productController()
