'use strict'

import { cartModel } from './dao/models/Carts.model.js'
import { productModel } from './dao/models/Products.model.js'

export const cartCreator = async (req, res) => {
    try {
        let newCart = await cartModel.create({ products: [] })
        res.status(200).json({
            info: {
                status: 200,
                message: 'Carrito creado',
            },
            results: newCart,
        })
    } catch (error) {
        res.status(409).json({
            info: {
                status: 409,
                message: 'No se pudo crear el carrito',
            },
            results: [],
        })
    }
}

export const cartGetterById = async (req, res) => {
    let cid = req.params.cid
    try {
        let filteredCart = await cartModel.findById(cid).populate('products.product')
        res.status(200).json({
            info: {
                status: 200,
                message: 'Carrito encontrado',
            },
            results: filteredCart.products,
        })
    } catch (error) {
        res.status(404).json({
            info: {
                status: 404,
                message: 'No se pudo encontro el carrito con ese ID',
            },
            results: [],
        })
    }
}

export const addProductToCart = async (req, res) => {
    let cId = req.params.cid
    let pId = req.params.pid
    try {
        let product = await productModel.findById(pId)
        let cart = await cartModel.findById(cId).lean()
        let updatedCart = []
        const cartIndex = cart.products.findIndex(el => el.product == product.id)

        if (cartIndex === -1) {
            cart.products.push({ product: product._id, quantity: 1 })
            updatedCart = await cartModel.findByIdAndUpdate({ _id: cId }, cart, { new: true })
        } else {
            cart.products[cartIndex].quantity++
            updatedCart = await cartModel.findByIdAndUpdate({ _id: cId }, cart, { new: true })
        }

        res.status(200).json({
            info: {
                status: 200,
                message: 'Carrito actualizado',
            },
            results: await cartModel.findById(cId),
        })
    } catch (error) {
        let cartError = error.message.includes('"carts"')
        res.status(404).json({
            info: {
                status: 404,
                message: cartError ? 'No se puede encontrar el carrito' : 'No se puede encontrar el producto',
            },
            results: [],
        })
    }
}

export const emptyCart = async (req, res) => {
    let cId = req.params.cid
    try {
        let updatedCart = await cartModel.findByIdAndUpdate({ _id: cId }, { products: [] }, { new: true })

        res.status(200).json({
            info: {
                status: 200,
                message: 'Carrito actualizado',
            },
            results: updatedCart,
        })
    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            info: {
                status: 404,
                message: 'No se puede encontrar el carrito',
            },
            results: cId,
        })
    }
}

export const deleteProductFromCart = async (req, res) => {
    let cId = req.params.cid
    let pId = req.params.pid
    try {
        let cart = await cartModel.findById(cId).lean()
        const cartIndex = cart.products.findIndex(el => el.product == pId)
        let match = true

        if (cartIndex === -1) {
            match = false
        } else {
            cart.products.splice(cartIndex, 1)
            await cartModel.findByIdAndUpdate({ _id: cId }, cart, { new: true })
        }

        res.status(200).json({
            info: {
                status: match ? 200 : 204,
                message: match ? 'Carrito actualizado' : `El carrito no contiene ningun producto de ID ${pId}`,
            },
            results: await cartModel.findById(cId),
        })
    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            info: {
                status: 404,
                message: `No se puede encontrar el carrito con ID ${cId}`,
            },
            results: cId,
        })
    }
}

export const updateProductFromCart = async (req, res) => {
    let cId = req.params.cid
    let pId = req.params.pid
    let updatedQuantity = req.body
    try {
        let cart = await cartModel.findById(cId).lean()
        const cartIndex = cart.products.findIndex(el => el.product == pId)
        let match = true

        if (cartIndex === -1) {
            match = false
        } else {
            cart.products[cartIndex].quantity = updatedQuantity.quantity
            await cartModel.findByIdAndUpdate({ _id: cId }, cart, { new: true })
        }

        res.status(200).json({
            info: {
                status: match ? 200 : 204,
                message: match ? 'Carrito actualizado' : `El carrito no contiene ningun producto de ID ${pId}`,
            },
            results: await cartModel.findById(cId),
        })
    } catch (error) {
        console.log(error.message)
        let cartError = error.message.includes('"carts"')
        res.status(cartError ? 404 : 400).json({
            info: {
                status: cartError ? 404 : 400,
                message: cartError
                    ? `No se puede encontrar el carrito con ID ${cId}`
                    : `${updatedQuantity.quantity} no es un numero`,
            },
            results: cartError ? cId : updatedQuantity,
        })
    }
}

export const updatePaginatedCart = async (req, res) => {
    let cId = req.params.cid
    try {
        let cart = await cartModel.findById(cId).populate('products.product')
        let updatedCart = await cartModel.findByIdAndUpdate({ _id: cId }, cart, { new: true })

        res.status(200).json({
            info: {
                status: 200,
                message: 'Carrito actualizado',
            },
            results: updatedCart,
        })
    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            info: {
                status: 404,
                message: 'No se puede encontrar el carrito',
            },
            results: cId,
        })
    }
}
