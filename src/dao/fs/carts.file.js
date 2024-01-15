import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { __dirname } from '../../helpers/utils.js'

const CARTS_FILE_PATH = path.join(__dirname, '..', 'data', 'carts.json')

export default class Carts {
    constructor() {}

    getAll = async () => {
        const cartsData = await fs.promises.readFile(CARTS_FILE_PATH, 'utf8')
        const carts = JSON.parse(cartsData)
        return carts
    }

    getById = async id => {
        const cartsData = await fs.promises.readFile(CARTS_FILE_PATH, 'utf8')
        const carts = JSON.parse(cartsData)
        const cart = carts.find(p => p._id === id)
        return cart
    }

    populate = async id => {
        const cartsData = await fs.promises.readFile(CARTS_FILE_PATH, 'utf8')
        const carts = JSON.parse(cartsData)
        const cart = carts.find(p => p._id === id)
        return cart
    }

    create = async () => {
        const cartsData = await fs.promises.readFile(CARTS_FILE_PATH, 'utf8')
        const carts = JSON.parse(cartsData)

        const newCart = {
            _id: uuidv4(),
            products: [],
        }

        carts.push(newCart)
        await fs.promises.writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, 2), 'utf8')

        return newCart
    }

    update = async (id, data) => {
        const cartsData = await fs.promises.readFile(CARTS_FILE_PATH, 'utf8')
        const carts = JSON.parse(cartsData)
        console.log(data)

        const updatedCartIndex = carts.findIndex(p => p._id === id)
        console.log('updatedCartIndex: ' + updatedCartIndex)
        if (updatedCartIndex !== -1) {
            carts[updatedCartIndex] = data
            await fs.promises.writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, 2), 'utf8')
            return carts[updatedCartIndex]
        }

        return null // Si el carrito no existe
    }

    delete = async id => {
        const cartsData = await fs.promises.readFile(CARTS_FILE_PATH, 'utf8')
        const carts = JSON.parse(cartsData)

        const deletedCartIndex = carts.findIndex(p => p._id === id)
        if (deletedCartIndex !== -1) {
            const deletedCart = carts.splice(deletedCartIndex, 1)[0]
            await fs.promises.writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, 2), 'utf8')
            return deletedCart
        }

        return null // Si el carrito no existe
    }
}
