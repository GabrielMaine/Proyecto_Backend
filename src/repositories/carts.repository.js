import getDAOS from '../dao/factory.js'
import CartDTO from '../dao/dtos/carts.dto.js'

const { cartDAO, productDAO } = getDAOS()
class CartRepository {
    constructor() {
        this.dao = cartDAO
    }

    async getAll() {
        let result = await this.dao.getAll()
        return result
    }

    async getById(id) {
        let result = await this.dao.getById(id)
        return result
    }

    async populate(id) {
        let result = await this.dao.populate(id)
        return result
    }

    async create() {
        let result = await this.dao.create()
        return result
    }

    async update(id, payload) {
        let cart = await this.dao.getById(id)
        cart = { ...cart, ...payload }
        const data = new CartDTO(cart)
        let result = await this.dao.update(id, data)
        return result
    }

    async delete(id) {
        let result = await this.dao.delete(id)
        return result
    }
}

export default new CartRepository()
