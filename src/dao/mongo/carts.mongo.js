import { cartModel } from './models/Carts.model.js'

export default class Carts {
    constructor() {}

    getAll = async () => {
        let carts = await cartModel.find().lean()
        return carts
    }

    getById = async id => {
        let cart = await cartModel.findById(id).lean()
        return cart
    }

    populate = async id => {
        let cart = await cartModel.findById(id).populate('products.product').lean()
        return cart
    }

    create = async () => {
        let cart = await cartModel.create({ products: [] })
        return cart
    }

    update = async (id, data) => {
        let cart = await cartModel.findByIdAndUpdate({ _id: id }, data, { new: true })
        return cart
    }

    delete = async id => {
        let cart = await cartModel.findByIdAndDelete(id)
        return cart
    }
}
