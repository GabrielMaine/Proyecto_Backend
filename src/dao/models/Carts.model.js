'use strict'

import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const cartsCollection = 'carts' //Nombre de la coleccion

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity: Number,
            },
        ],
        default: [],
    },
})

cartsSchema.plugin(mongoosePaginate)

export const cartModel = mongoose.model(cartsCollection, cartsSchema)
