'use strict'

import { product, carts } from './helpers.js'
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
        let filteredCart = await cartModel.findById(cid)
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
        let cartProducts = cart.products
        let updatedCart = []
        const cartIndex = cartProducts.findIndex(el => el.id === pId)

        if (cartIndex === -1) {
            let newProduct = {
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: 1,
            }
            cartProducts.push(newProduct)
            updatedCart = await cartModel.findByIdAndUpdate({ _id: cId }, { products: cartProducts }, { new: true })
        } else {
            cartProducts[cartIndex].quantity++
            updatedCart = await cartModel.findByIdAndUpdate({ _id: cId }, { products: cartProducts }, { new: true })
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
                message: cartError ? 'No se puede encontrar en carrito' : 'No se puede encontrar el producto',
            },
            results: [],
        })
    }
}
