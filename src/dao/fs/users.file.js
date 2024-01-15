import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { __dirname } from '../../helpers/utils.js'

const USERS_FILE_PATH = path.join(__dirname, '..', 'data', 'users.json')

export default class Users {
    constructor() {}

    getAll = async () => {
        try {
            const usersData = await fs.promises.readFile(USERS_FILE_PATH, 'utf8')
            const users = JSON.parse(usersData)
            return users
        } catch (error) {
            console.error('Error al leer el archivo de usuarios:', error)
            return []
        }
    }

    getById = async id => {
        try {
            const usersData = await fs.promises.readFile(USERS_FILE_PATH, 'utf8')
            const users = JSON.parse(usersData)
            const user = users.find(u => u._id === id)
            return user
        } catch (error) {
            console.error('Error al leer el archivo de usuarios:', error)
            return null
        }
    }

    getByEmail = async email => {
        try {
            const usersData = await fs.promises.readFile(USERS_FILE_PATH, 'utf8')
            const users = JSON.parse(usersData)
            const user = users.find(u => u.email === email)
            return user
        } catch (error) {
            console.error('Error al leer el archivo de usuarios:', error)
            return null
        }
    }

    getByCart = async cId => {
        try {
            const usersData = await fs.promises.readFile(USERS_FILE_PATH, 'utf8')
            const users = JSON.parse(usersData)
            const user = users.find(u => u.cart === cId)
            return user
        } catch (error) {
            console.error('Error al leer el archivo de usuarios:', error)
            return null
        }
    }

    create = async data => {
        try {
            console.log('-----------------------CREATE-------------------------------')
            const usersData = await fs.promises.readFile(USERS_FILE_PATH, 'utf8')
            const users = JSON.parse(usersData)

            console.log(users)

            // Verificar si ya existe un usuario con el mismo email
            const existingUser = users.find(u => u.email === data.email)
            if (existingUser) {
                throw new Error('Email already registered')
            }

            const newUser = {
                _id: uuidv4(),
                ...data,
            }

            users.push(newUser)
            await fs.promises.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8')

            return newUser
        } catch (error) {
            console.error('Error al crear un nuevo usuario:', error)
            throw error
        }
    }

    update = async (id, data) => {
        try {
            const usersData = await fs.promises.readFile(USERS_FILE_PATH, 'utf8')
            const users = JSON.parse(usersData)

            const updatedUserIndex = users.findIndex(u => u._id === id)
            if (updatedUserIndex !== -1) {
                users[updatedUserIndex] = { ...users[updatedUserIndex], ...data }
                await fs.promises.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8')
                return users[updatedUserIndex]
            }

            return null // Si el usuario no existe
        } catch (error) {
            console.error('Error al actualizar el usuario:', error)
            return null
        }
    }

    delete = async id => {
        try {
            const usersData = await fs.promises.readFile(USERS_FILE_PATH, 'utf8')
            const users = JSON.parse(usersData)

            const deletedUserIndex = users.findIndex(u => u._id === id)
            if (deletedUserIndex !== -1) {
                const deletedUser = users.splice(deletedUserIndex, 1)[0]
                await fs.promises.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8')
                return deletedUser
            }

            return null // Si el usuario no existe
        } catch (error) {
            console.error('Error al eliminar el usuario:', error)
            return null
        }
    }
}
