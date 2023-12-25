import userService from '../services/User.service.js'
import cartService from '../services/Carts.service.js'

class userController {
    async createUser(req, res) {
        try {
            const data = req.body
            const response = await userService.createUser(data)
            res.status(201).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async getUser(req, res) {
        try {
            const { email } = req.body
            const response = await userService.getUser(email)
            res.status(200).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async getAllUsers(req, res) {
        try {
            const response = await userService.getAllUsers()
            res.status(200).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async updateUser(req, res) {
        try {
            const userId = req.params.id
            const data = req.body
            const response = await userService.updateUser(userId, data)
            res.status(200).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }
}

export default new userController()
