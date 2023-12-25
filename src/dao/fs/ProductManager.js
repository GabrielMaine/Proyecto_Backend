//Usamos fs asincrono para manejar los archivos
import fs from 'fs'

//Definimos la clase ProductManager con su Constructor y sus metodos
class ProductManager {
    constructor(path) {
        this.path = path
    }

    static id = 0

    //Buscamos el archivo de la ruta del objeto y devolvemos su contenido. Si no existe dicho archivo devolvemos un array vacio
    getProducts = async () => {
        if (fs.existsSync(`${this.path}`)) {
            let products = await fs.promises.readFile(`${this.path}`, 'utf-8')
            return JSON.parse(products)
        } else {
            return []
        }
    }

    addProduct = async newProduct => {
        let products = await this.getProducts()
        if (products.some(el => el.code === newProduct.code)) {
            console.log(`Ya existe un producto con el código ${newProduct.code} cargado en el sistema.`)
        } else {
            // ProductManager.id++
            // newProduct.id=ProductManager.id
            products.push(newProduct)
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(products))
        }
    }

    getProductById = async id => {
        let products = await this.getProducts()
        const comparacion = products.filter(el => el.id == id)
        if (comparacion.length !== 0) {
            return comparacion[0]
        } else {
            return new Error('Not found')
        }
    }

    updateProduct = async (id, newProduct) => {
        let products = await this.getProducts()
        const index = products.findIndex(el => el.id == id)
        if (index === -1) {
            return new Error('El producto a actualizar no existe en la base de datos.')
        } else {
            for (const property in products[index]) {
                if (Object.hasOwn(newProduct, property)) {
                    products[index][property] = newProduct[property]
                }
            }
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(products))
        }
    }

    deleteProduct = async id => {
        let products = await this.getProducts()
        const index = products.findIndex(el => el.id == id)
        if (index === -1) {
            return new Error(`No se encontro el objeto con ID: ${id}.`)
        } else {
            products.splice(index, 1)
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(products))
            return `Se elimino el objeto con ID: ${id}.`
        }
    }

    deleteFile = async () => {
        await fs.promises.unlink(`${this.path}`)
    }

    getLength = async () => {
        let products = await this.getProducts()
        return products.length
    }
}

export default ProductManager
