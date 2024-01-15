import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { __dirname } from '../../helpers/utils.js'

const PRODUCTS_FILE_PATH = path.join(__dirname, '..', 'data', 'products.json')

export default class Products {
    constructor() {}

    getAll = async () => {
        const productsData = await fs.promises.readFile(PRODUCTS_FILE_PATH, 'utf8')
        const products = JSON.parse(productsData)
        return products
    }

    getById = async id => {
        const productsData = await fs.promises.readFile(PRODUCTS_FILE_PATH, 'utf8')
        const products = JSON.parse(productsData)
        const product = products.find(p => p.id == id)
        return product
    }

    create = async data => {
        const productsData = await fs.promises.readFile(PRODUCTS_FILE_PATH, 'utf8')
        const products = JSON.parse(productsData)

        const existingProduct = products.find(p => p.code === data.code)
        if (existingProduct) {
            throw new Error(`Code ${data.code} already exists in database`)
        }

        const newProduct = {
            _id: uuidv4(),
            ...data,
        }

        products.push(newProduct)
        await fs.promises.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf8')

        return newProduct
    }

    update = async (id, data) => {
        const productsData = await fs.promises.readFile(PRODUCTS_FILE_PATH, 'utf8')
        const products = JSON.parse(productsData)

        const updatedProductIndex = products.findIndex(p => p.id == id)
        if (updatedProductIndex !== -1) {
            for (const property in products[updatedProductIndex]) {
                if (Object.hasOwn(data, property)) {
                    products[updatedProductIndex][property] = data[property]
                }
            }
            await fs.promises.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf8')
            return products[updatedProductIndex]
        }

        return null // Si el producto no existe
    }

    delete = async id => {
        const productsData = await fs.promises.readFile(PRODUCTS_FILE_PATH, 'utf8')
        const products = JSON.parse(productsData)

        const deletedProductIndex = products.findIndex(p => p.id == id)
        if (deletedProductIndex !== -1) {
            const deletedProduct = products.splice(deletedProductIndex, 1)[0]
            await fs.promises.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf8')
            return deletedProduct
        }

        return null // Si el producto no existe
    }

    paginate = async (queries, options) => {
        const productsData = await fs.promises.readFile(PRODUCTS_FILE_PATH, 'utf8')
        let products = JSON.parse(productsData)
        options.page = parseInt(options.page)
        options.limit = parseInt(options.limit)

        //Primero filtro
        if (queries.status) {
            products = products.filter(p => p.status === queries.status)
        }
        if (queries.category) {
            products = products.filter(p => p.category === queries.category)
        }

        //Luego pagino
        const startIndex = (options.page - 1) * options.limit
        const endIndex = startIndex + options.limit
        const paginatedProducts = products.slice(startIndex, endIndex)

        //Hago el sort
        if (options.sort === 'desc' || options.sort === -1) {
            paginatedProducts.reverse()
        }

        //Finalmente armo el payload

        let totalPages = Math.ceil(products.length / options.limit)
        let hasPrevPage = options.page === 1 ? false : true
        let hasNextPage = options.page >= totalPages ? false : true

        const response = {
            docs: paginatedProducts,
            totalPages: totalPages,
            prevPage: hasPrevPage ? parseInt(options.page) - 1 : null,
            nextPage: hasNextPage ? parseInt(options.page) + 1 : null,
            page: parseInt(options.page),
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
        }

        return response
    }
}
