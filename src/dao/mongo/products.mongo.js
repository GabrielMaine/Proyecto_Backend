import { productModel } from './models/Products.model.js'

export default class Products {
    constructor() {}

    getAll = async () => {
        let products = await productModel.find().lean()
        return products
    }

    getById = async id => {
        let product = await productModel.findById(id).lean()
        return product
    }

    create = async data => {
        let product = await productModel.create(data)
        return product
    }

    update = async (id, data) => {
        let product = await productModel.findOneAndUpdate({ _id: id }, data, { new: true })
        return product
    }

    delete = async id => {
        let product = await productModel.findByIdAndDelete(id)
        return product
    }

    paginate = async (queries, options) => {
        let product = await productModel.paginate(queries, options)
        return product
    }
}
