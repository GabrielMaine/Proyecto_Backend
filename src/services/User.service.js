import bcrypt from 'bcrypt'
import { userModel } from '../dao/mongo/models/Users.model.js'
import cartService from './Carts.service.js'
import config from '../config/config.js'

class userService {
    async createUser(data) {
        try {
            console.log(data)
            const cart = await cartService.createCart()
            data.cart = cart._id
            data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10))
            data.role = data.email === config.adminEmail ? 'admin' : 'user'
            console.log('createUser: ' + data)
            console.log(data)
            const result = await userModel.create(data)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async getUser(email) {
        try {
            console.log('getUser: email: ' + email)
            const result = await userModel.findOne({ email }).lean()
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async getAllUsers() {
        try {
            console.log('getUsers')
            const result = await userModel.find().lean()
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async updateUser(id, data) {
        try {
            console.log('updateUser: id: ' + id)
            console.log(data)
            const result = await userModel.updateOne({ _id: id }, data)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async getUserbyId(id) {
        try {
            console.log('getUserbyID: id: ' + id)
            const result = await userModel.findById(id)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new userService()
