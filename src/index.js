'use strict'

//Importamos express y las rutas de los productos y de los carritos

import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import { router as productRouter } from './routes/Product.routes.js'
import { router as cartRouter } from './routes/Cart.routes.js'
import { router as viewsRouter } from './routes/Views.routes.js'
import { product } from './helpers.js'

//Configuramos los servidores
const app = express()
const httpServer = app.listen(8080, () => console.log('Servidor en el puerto 8080'))
const socketServer = new Server(httpServer)

//Inicializamos el motor
app.engine('handlebars', handlebars.engine())
app.set('views', process.cwd() + '/src/views')
app.set('view engine', 'handlebars')

// app.use(express.static('public'))
app.use(express.static(process.cwd() + '/public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)

socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado')
    socket.on('message', data => {
        console.log(data)
    })
    socket.on('new-product', async data => {
        await product.addProduct(data)
        console.log('Nuevo producto')
        let products = await product.getProducts()
        socket.emit('reRender-products', products)
    })
    socket.on('delete-product', async data => {
        await product.deleteProduct(data)
        console.log('Producto borrado')
        let products = await product.getProducts()
        socket.emit('reRender-products', products)
    })
})
