'use strict'

import Cart from './Cart.js'
import { product, carts } from './helpers.js'
import { v4 as uuidv4 } from 'uuid'

export const cartCreator = async (req, res) => {
    //Generamos un ID y creamos un nuevo carrito vacio con ese ID
    let newID = uuidv4()
    let newCart = new Cart(newID)

    //Almacenamos la cantidad de carritos actualmente en el sistema e intentamos cargar el nuevo carrito
    let currentLength = await carts.getLength()
    await carts.addCart(newCart)

    //Comparamos la cantidad de carritos actual con la almacenada anteriormente. Si es igual el nuevo carrito no se cargo
    res.status((await carts.getLength()) !== currentLength ? 200 : 409).json({
        info: {
            status: (await carts.getLength()) !== currentLength ? 200 : 409,
            message: (await carts.getLength()) !== currentLength ? 'Carrito creado' : 'No se pudo crear el carrito',
        },
        results: newCart,
    })
}

export const cartGetterById = async (req, res) => {
    let cid = req.params.cid
    let filteredCart = await carts.getCartById(cid)

    //Verificamos que se haya encontrado un carrito con ese ID, en caso contrario mostramos un 404
    res.status(filteredCart.products ? 200 : 404).json({
        info: {
            status: filteredCart.products ? 200 : 404,
            message: filteredCart.products ? 'Carrito encontrado' : 'No se pudo encontro el carrito con ese ID',
        },
        results: filteredCart.products,
    })
}

export const addProductToCart = async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    let filteredProduct = await product.getProductById(pid)

    //Verificamos que existan producto y carrito con sus IDs antes de cargar al carrito, en caso contrario devolvemos 404
    let productStatus = Object.keys(filteredProduct).length !== 0
    let cartStatus = Object.keys(await carts.getCartById(cid)).length !== 0
    if (productStatus && cartStatus) {
        await carts.addItemToCart(cid, pid)
    }

    res.status(productStatus && cartStatus ? 200 : 404).json({
        info: {
            status: productStatus && cartStatus ? 200 : 404,
            message:
                productStatus && cartStatus
                    ? 'Carrito actualizado'
                    : productStatus
                    ? 'Cart ID inexistente'
                    : 'Product ID inexistente',
        },
        results: await carts.getCartById(cid),
    })
}
