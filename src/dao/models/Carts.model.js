'use strict'

import mongoose from 'mongoose'

const cartsCollection = 'carts' //Nombre de la coleccion

const cartsSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: [],
    },
})

export const cartModel = mongoose.model(cartsCollection, cartsSchema)
