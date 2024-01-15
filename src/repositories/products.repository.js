import getDAOS from '../dao/factory.js'
import ProductDTO from '../dao/dtos/products.dto.js'

const { productDAO } = getDAOS()
class ProductRepository {
    constructor() {
        this.dao = productDAO
    }

    async getAll() {
        let result = await this.dao.getAll()
        return result
    }

    async getById(id) {
        let result = await this.dao.getById(id)
        return result
    }

    async create(payload) {
        const data = new ProductDTO(payload)
        let result = await this.dao.create(data)
        return result
    }

    async update(id, payload) {
        let product = await this.dao.getById(id)
        product = { ...product, ...payload }
        const data = new ProductDTO(product)
        let result = await this.dao.update(id, data)
        return result
    }

    async delete(id) {
        let result = await this.dao.delete(id)
        return result
    }

    async paginate(queries, options) {
        let result = await this.dao.paginate(queries, options)
        return result
    }
}

export default new ProductRepository()
