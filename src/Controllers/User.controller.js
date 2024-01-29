import UserRepository from '../repositories/users.repository.js'

class userController {
    async createUser(req, res) {
        try {
            const data = req.body
            const response = await UserRepository.create(data)
            res.status(201).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async getUser(req, res) {
        try {
            const { email } = req.body
            const response = await UserRepository.getByEmail(email)
            res.status(200).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async getAllUsers(req, res) {
        try {
            const response = await UserRepository.getAll()
            res.status(200).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
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
            const response = await UserRepository.update(userId, data)
            res.status(200).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }
}

export default new userController()
