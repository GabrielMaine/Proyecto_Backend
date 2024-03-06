import { userModel } from './models/Users.model.js'

export default class Users {
    constructor() {}

    getAll = async () => {
        let users = await userModel.find().lean()
        return users
    }

    getById = async id => {
        let user = await userModel.findById(id).lean()
        return user
    }

    getByEmail = async email => {
        let user = await userModel.findOne({ email }).lean()
        return user
    }

    getByCart = async cId => {
        let user = await userModel.findOne({ cart: cId }).lean()
        return user
    }

    getByToken = async token => {
        let user = await userModel.findOne({ token: token }).lean()
        return user
    }

    create = async data => {
        let user = await userModel.create(data)
        return user
    }

    update = async (id, data) => {
        let user = await userModel.updateOne({ _id: id }, data, { new: true })
        return user
    }

    delete = async id => {
        let user = await userModel.findByIdAndDelete(id)
        return user
    }
}
