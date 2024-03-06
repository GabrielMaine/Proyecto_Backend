import usersRepository from '../repositories/users.repository.js'
import UserRepository from '../repositories/users.repository.js'
import { v4 as uuid } from 'uuid'
import MailingService from '../services/mailing/mailing.js'
import { isValidPassword } from '../helpers/utils.js'
import bcrypt from 'bcrypt'

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

    async premiumUser(req, res) {
        try {
            const userId = req.params.id
            const user = await UserRepository.getById(userId)
            switch (user.role) {
                case 'user': {
                    const documents = user.documents || []
                    let uploadedDocuments = documents.map(doc => doc.name.substring(userId.length + 1))
                    uploadedDocuments = uploadedDocuments.map(e => e.toUpperCase())
                    const requiredDocuments = ['identification.pdf', 'address.pdf', 'account.pdf']
                    for (const value of requiredDocuments) {
                        if (!uploadedDocuments.includes(value.toUpperCase())) {
                            throw new Error(`Documentation error: Missing ${value} document`)
                        }
                    }
                    user.role = 'premium'
                    break
                }
                case 'premium': {
                    user.role = 'user'
                    break
                }
                case 'admin': {
                    throw new Error('Role error: Can not change admin role to premium')
                }
                default: {
                    throw new Error('Role error: Invalid role detected')
                }
            }
            const response = await UserRepository.update(userId, user)
            res.status(200).json({
                user: response,
                status: 'Success',
            })
        } catch (error) {
            if (error.message.includes('Cast to ObjectId failed')) {
                res.status(404).json({
                    status: 'Not found',
                    error: error.message,
                })
            } else {
                if (error.message.includes('Documentation error') || error.message.includes('Role error')) {
                    res.status(401).json({
                        status: 'Not authorized',
                        error: error.message,
                    })
                } else {
                    req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
                    res.status(500).json({
                        status: 'Error',
                        error: error.message,
                    })
                }
            }
        }
    }

    async restorePassword(req, res) {
        try {
            let email = req.body.email
            let user = await usersRepository.getByEmail(email)
            if (user) {
                let id = uuid()
                let expirationDate = new Date()
                expirationDate.setHours(expirationDate.getHours() + 1)
                let token = {
                    uuid: id,
                    expiration: expirationDate,
                }
                ;(user.token = id), (user.expiration = expirationDate)
                await UserRepository.update(user._id, user)
                //Enviamos el mail
                const mailer = new MailingService()
                const resetLink = `http://localhost:8080/resetPassword?token=${token.uuid}`
                const sendMailer = await mailer.sendMailUser({
                    from: 'pruebaCurso@gmail.com',
                    to: user.email,
                    subject: 'Recuperar contraseña',
                    html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
                })
            }
            res.status(200).json({ status: 'ok' })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async resetPassword(req, res) {
        try {
            let userData = req.body
            let user = await usersRepository.getByEmail(userData.email)
            let repeatedPassword = isValidPassword(user, userData.password)
            if (repeatedPassword) {
                res.status(400).json({ status: 'conflict', message: 'Repeated password' })
            } else {
                let updatedUser = { ...user, password: bcrypt.hashSync(userData.password, bcrypt.genSaltSync(10)) }
                let result = await usersRepository.update(user._id, updatedUser)

                //Enviamos un mail
                const mailer = new MailingService()
                const sendMailer = await mailer.sendMailUser({
                    from: 'pruebaCurso@gmail.com',
                    to: user.email,
                    subject: 'Contraseña reestablecida',
                    html: '<p>Su contraseña ha sido reestablecida con éxito</p>',
                })

                res.status(200).json({ status: 'ok', payload: result })
            }
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(400).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }

    async uploadDocument(req, res) {
        try {
            const userId = req.params.id
            const user = await UserRepository.getById(userId)
            const documents = user.documents || []
            req.files.forEach(e => {
                const newDocument = {
                    name: e.filename,
                    reference: e.path,
                }
                const existingDocument = documents.find(doc => doc.reference === newDocument.reference)
                if (!existingDocument) {
                    documents.push(newDocument)
                }
            })
            user.documents = documents
            const updatedUser = await usersRepository.update(userId, user)
            res.status(200).json({ status: 'success', payload: updatedUser })
        } catch (error) {
            req.logger.error(`${error.message} at: ${req.url} - ${new Date().toLocaleString()}`)
            res.status(500).json({
                error: error.message,
                status: 'Fail',
            })
        }
    }
}

export default new userController()
