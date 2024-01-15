import { productModel } from '../dao/mongo/models/Products.model.js'

class productService {
    async createProduct(data) {
        try {
            const result = await productModel.create(data)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getProduct(id) {
        try {
            const result = await productModel.findById(id)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getAllProducts() {
        try {
            const result = await productModel.find().lean()
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateProduct(id, data) {
        try {
            const result = await productModel.findOneAndUpdate({ _id: id }, data, { new: true })
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productModel.findByIdAndDelete(id)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async paginateProducts(queries, options) {
        try {
            const result = await productModel.paginate(queries, options)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new productService()
