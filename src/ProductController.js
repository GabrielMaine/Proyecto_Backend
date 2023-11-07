'use strict'

import { productModel } from './dao/models/Products.model.js'

export const productGetter = async (req, res) => {
    let limit = req.query.limit
    let products = await productModel.find({}).lean()
    let filteredProducts = []

    if (!limit || limit < 0 || isNaN(limit)) {
        //Si no existe el query, si el limite es negativo o si no es un numero devolvemos todos los productos
        res.status(products.length > 0 ? 200 : 204).json({
            info: {
                status: products.length > 0 ? 200 : 204,
                message: 'Query invalido',
            },
            results: products,
        })
    } else {
        //Si hay un query valido devolvemos tantos productos como sea posible hasta alcanzar el limite o que no haya mas productos
        for (let i = 0; i < limit; i++) {
            if (products[i]) {
                filteredProducts.push(products[i])
            }
        }
        res.status(filteredProducts.length > 0 ? 200 : 204).json({
            info: {
                status: filteredProducts.length > 0 ? 200 : 204,
                message: filteredProducts.length > 0 ? 'Carrito encontrado' : 'Carrito vacio',
            },
            results: filteredProducts,
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
