'use strict'

import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = 'products' //Nombre de la coleccion

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        index: true,
    },
    thumbnail: {
        type: String,
        required: false,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Disponible', 'No_disponible'],
        default: 'Disponible',
    },
})

productsSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productsCollection, productsSchema)
