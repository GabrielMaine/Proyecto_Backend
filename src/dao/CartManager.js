//Usamos fs asincrono para manejar los archivos
import fs from 'fs'

//Definimos la clase CartManager con su Constructor y sus metodos
class CartManager {
    constructor(path) {
        this.path = path
    }

    //Buscamos el archivo de la ruta del objeto y devolvemos su contenido. Si no existe dicho archivo devolvemos un array vacio
    getCarts = async () => {
        if (fs.existsSync(`${this.path}`)) {
            let carts = await fs.promises.readFile(`${this.path}`, 'utf-8')
            return JSON.parse(carts)
        } else {
            return []
        }
    }

    //Agregamos un carrito nuevo al archivo si no repite su ID con otro que ya este cargado
    addCart = async newCart => {
        let carts = await this.getCarts()
        if (carts.some(el => el.id === newCart.id)) {
            console.log(`Ya existe un carrito con el ID ${newCart.id} cargado en el sistema.`)
        } else {
            carts.push(newCart)
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(carts))
        }
    }

    //Buscamos en el archivo y extraemos un carrito segun su ID
    getCartById = async id => {
        let carts = await this.getCarts()
        const comparacion = carts.filter(el => el.id === id)
        if (comparacion.length !== 0) {
            return comparacion[0]
        } else {
            return new Error('Not found')
        }
    }

    //Agregamos un item al carrito segun ID de carrito y de producto
    addItemToCart = async (id, newId) => {
        let carts = await this.getCarts()
        const cartIndex = carts.findIndex(el => el.id === id)
        if (cartIndex === -1) {
            return new Error('No existe carrito con ese ID')
        } else {
            const productIndex = carts[cartIndex].products.findIndex(el => el.id === newId)
            if (productIndex === -1) {
                let newProduct = { id: newId, quantity: 1 }
                carts[cartIndex].products.push(newProduct)
            } else {
                carts[cartIndex].products[productIndex].quantity++
            }
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(carts))
        }
    }

    //Eliminamos un carrito segun su ID
    deleteCart = async id => {
        let carts = await this.getCarts()
        const index = carts.findIndex(el => el.id === id)
        if (index === -1) {
            return new Error(`No se encontro el carrito con ID: ${id}.`)
        } else {
            carts.splice(index, 1)
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(carts))
            return `Se elimino el carrito con ID: ${id}.`
        }
    }

    //Borramos el archivo .json
    deleteFile = async () => {
        await fs.promises.unlink(`${this.path}`)
    }

    //Obtenemos la cantidad de carritos en memoria
    getLength = async () => {
        let carts = await this.getCarts()
        return carts.length
    }
}

export default CartManager
