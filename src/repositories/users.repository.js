import getDAOS from '../dao/factory.js'
import UserDTO from '../dao/dtos/users.dto.js'
import bcrypt from 'bcrypt'
import config from '../config/config.js'

const { userDAO, cartDAO } = getDAOS()
class UserRepository {
    constructor() {
        this.dao = userDAO
    }

    async getAll() {
        let result = await this.dao.getAll()
        return result
    }

    async getById(id) {
        let result = await this.dao.getById(id)
        return result
    }

    async getByEmail(email) {
        let result = await this.dao.getByEmail(email)
        return result
    }

    async getByCart(cId) {
        let result = await this.dao.getByCart(cId)
        return result
    }

    async getByToken(token) {
        let result = await this.dao.getByToken(token)
        return result
    }

    async create(payload) {
        const cart = await cartDAO.create()
        payload.cart = cart._id
        payload.password = bcrypt.hashSync(payload.password, bcrypt.genSaltSync(10))
        payload.role = payload.email === config.adminEmail ? 'admin' : 'user'
        const data = new UserDTO(payload)
        let result = await this.dao.create(data)
        return result
    }

    async update(id, payload) {
        let user = await this.dao.getById(id)
        user = { ...user, ...payload }
        const data = new UserDTO(user)
        let result = await this.dao.update(id, data)
        return result
    }

    async delete(id) {
        let result = await this.dao.delete(id)
        return result
    }
}

export default new UserRepository()
