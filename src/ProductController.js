'use strict'

import { product } from './helpers.js'
import { v4 as uuidv4 } from 'uuid'

export const productGetter = async (req, res) => {
    let limit = req.query.limit
    let products = await product.getProducts()
    let filteredProducts = []

    if (!limit || limit < 0 || isNaN(limit)) {
        //Si no existe el query, si el limite es negativo o si no es un numero devolvemos todos los productos
        res.status(products.length > 0 ? 200 : 204).json({
            info: {
                status: products.length > 0 ? 200 : 204,
                message: 'Query invalido',
            },
            results: products,
        })
    } else {
        //Si hay un query valido devolvemos tantos productos como sea posible hasta alcanzar el limite o que no haya mas productos
        for (let i = 0; i < limit; i++) {
            if (products[i]) {
                filteredProducts.push(products[i])
            }
        }
        res.status(filteredProducts.length > 0 ? 200 : 204).json({
            info: {
                status: filteredProducts.length > 0 ? 200 : 204,
                message: filteredProducts.length > 0 ? 'Carrito encontrado' : 'Carrito vacio',
            },
            results: filteredProducts,
        })
    }
}

export const productGetterById = async (req, res) => {
    let pId = req.params.pid
    let filteredProduct = await product.getProductById(pId)
    //Si el resultado de la busqueda es un objeto vacio mostramos un mensaje, si no mostramos el objeto
    res.status(Object.keys(filteredProduct).length !== 0 ? 200 : 404).json({
        info: {
            status: Object.keys(filteredProduct).length !== 0 ? 200 : 404,
            message: Object.keys(filteredProduct).length !== 0 ? 'Producto encontrado' : 'Producto no encontrado',
        },
        results: filteredProduct,
    })
}

export const productAdder = async (req, res) => {
    let newProduct = req.body

    //Verificamos que esten todos los campos obligatorios
    if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.code ||
        !newProduct.price ||
        !newProduct.stock ||
        !newProduct.category
    ) {
        //Informacion incompleta, devolvemos status 400
        return res.status(400).json({
            info: {
                status: 400,
                message: 'Incomplete values',
            },
            results: newProduct,
        })
    }

    //Si no se aclaró la propiedad status le asignamos el valor true por defecto
    if (newProduct.status === undefined) {
        newProduct.status = true
    }

    //Generamos un nuevo ID para el producto
    newProduct.id = uuidv4()

    //Si estan todos los campos procedemos a agregar el producto al catalogo
    await product.addProduct(newProduct)
    res.status(200).json({
        info: {
            status: 200,
            message: 'Product created',
        },
        results: newProduct,
    })
}

export const productUpdater = async (req, res) => {
    let pId = req.params.pid
    let modifiedProduct = req.body
    let filteredProduct = await product.getProductById(pId)

    //Si el resultado de la busqueda es un objeto vacio mostramos un mensaje, si no lo modificamos
    if (Object.keys(filteredProduct).length === 0) {
        res.status(404).json({
            info: {
                status: 'error',
                error: 'Product not found',
            },
            results: filteredProduct,
        })
    } else {
        await product.updateProduct(pId, modifiedProduct)
        res.status(200).json({
            info: {
                status: 'Success',
                error: 'Product updated',
            },
            results: modifiedProduct,
        })
    }
}

export const productDeleter = async (req, res) => {
    let pId = req.params.pid
    let currentLength = await product.getLength()
    await product.deleteProduct(pId)
    if ((await product.getLength()) === currentLength) {
        //Si la longitud antes y despues de ejecutar el metodo deleteProduct son iguales significa que no se elimino ningun producto
        res.status(404).json({
            info: {
                status: 404,
                error: 'Product not found',
            },
            results: pId,
        })
    } else {
        //Si la longitud es distinta confirmamos que se elimino el producto
        res.status(200).json({
            info: {
                status: 200,
                message: 'Product deleted',
            },
            results: await product.getProducts(),
        })
    }
}
