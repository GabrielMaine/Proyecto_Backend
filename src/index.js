'use strict'

//Importamos express, las clases ProductManager, Cart y CartManager y la libreria UUID para generar ids
import express from 'express'
import ProductManager from './ProductManager.js'
import CartManager from './CartManager.js'
import Cart from './Cart.js'
import { v4 as uuidv4 } from 'uuid'

const app = express()
app.listen(8080, () => console.log('Servidor en el puerto 8080'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Creamos una variable product vinculada al archivo Productos.json
let product = new ProductManager('./src/Productos.json')
//Creamos una variable carts vinculada al archivo Carritos.json
let carts = new CartManager('./src/Carritos.json')

//Rutas del catalogo

app.get('/api/products', async (req, res) => {
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
})

app.get('/api/products/:pid', async (req, res) => {
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
})

app.post('/api/products', async (req, res) => {
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
})

app.put('/api/products/:pid', async (req, res) => {
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
})

app.delete('/api/products/:pid', async (req, res) => {
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
    }
    //Si la longitud es distinta confirmamos que se elimino el producto
    res.status(200).json({
        info: {
            status: 200,
            message: 'Product deleted',
        },
        results: await product.getProducts(),
    })
})

//Rutas de los carritos

app.post('/api/carts/', async (req, res) => {
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
})

app.get('/api/carts/:cid', async (req, res) => {
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
})

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    let filteredProduct = await product.getProductById(parseFloat(pid))

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
})
