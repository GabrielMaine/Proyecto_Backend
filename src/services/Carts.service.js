import { cartModel } from '../dao/mongo/models/Carts.model.js'

class cartService {
    async createCart() {
        try {
            const result = await cartModel.create({ products: [] })
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async findCart(id) {
        try {
            console.log('findCart: id: ' + id)
            const result = await cartModel.findById(id).lean()
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async populateCart(id) {
        try {
            console.log('populateCart: id: ' + id)
            const result = await cartModel.findById(id).populate('products.product').lean()
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateCart(id, data) {
        try {
            console.log('updateCart: id: ' + id)
            console.log(data)
            const result = await cartModel.findByIdAndUpdate({ _id: id }, data, { new: true })
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new cartService()
