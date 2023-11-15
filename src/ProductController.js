'use strict'

import { productModel } from './dao/models/Products.model.js'

export const productGetter = async (req, res) => {
    let limit = req.query.limit || 10
    let page = req.query.page || 1
    let sort = req.query.sort || ''
    let status = req.query.status || ''
    let category = req.query.category || ''

    console.log(req.query)

    try {
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
        console.log(options)
        const queries = {}
        if (status !== '') {
            queries.status = status
        }
        if (category !== '') {
            queries.category = category
        }
        console.log(queries)

        let products = await productModel.paginate(queries, options)

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
                ? `http://localhost:8080/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&status=${status}`
                : null,
            nextLink: products.hasNextPage
                ? `http://localhost:8080/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&status=${status}`
                : null,
        }

        res.status(200).json({
            info: {
                status: products.docs.length > 0 ? 200 : 204,
                message: products.docs.length > 0 ? 'Productos encontrados' : 'No se encontraron productos',
            },
            results: results,
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            info: {
                status: 400,
                error: error.message,
            },
            results: error,
        })
    }
}

export const productGetterById = async (req, res) => {
    let pId = req.params.pid
    try {
        let filteredProduct = await productModel.find({ _id: pId })
        res.status(200).json({
            info: {
                status: 200,
                message: 'Producto encontrado',
            },
            results: filteredProduct,
        })
    } catch (error) {
        let filteredProduct = []
        res.status(404).json({
            info: {
                status: 404,
                message: 'Producto no encontrado',
            },
            results: filteredProduct,
        })
    }
}

export const productAdder = async (req, res) => {
    let newProduct = req.body
    try {
        let addedProduct = await productModel.create(newProduct)
        res.status(200).json({
            info: {
                status: 200,
                message: 'Product created',
            },
            results: addedProduct,
        })
    } catch (error) {
        console.log(error)
        let message = ''
        if (error.name === 'MongoServerError' && error.code === 11000) {
            message = 'Code must be unique'
        } else {
            message = 'Can\'t add product'
        }
        res.status(400).json({
            info: {
                status: 400,
                message: error.message,
            },
            results: newProduct,
        })
    }
}

export const productUpdater = async (req, res) => {
    let pId = req.params.pid
    let modifiedProduct = req.body
    try {
        let updatedProduct = await productModel.findOneAndUpdate({ _id: pId }, modifiedProduct, { new: true })
        res.status(200).json({
            info: {
                status: 'Success',
                error: 'Product updated',
            },
            results: updatedProduct,
        })
    } catch (error) {
        res.status(404).json({
            info: {
                status: 'error',
                error: 'Product not found',
            },
            results: [],
        })
    }
}

export const productDeleter = async (req, res) => {
    let pId = req.params.pid
    try {
        await productModel.findByIdAndDelete(pId)
        res.status(200).json({
            info: {
                status: 200,
                message: 'Product deleted',
            },
            results: await productModel.find({}).lean(),
        })
    } catch (error) {
        res.status(404).json({
            info: {
                status: 404,
                error: 'Product not found',
            },
            results: pId,
        })
    }
}
