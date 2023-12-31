'use strict'

import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import { router as productRouter } from './routes/Product.routes.js'
import { router as cartRouter } from './routes/Cart.routes.js'
import { router as viewsRouter } from './routes/Views.routes.js'
import { router as sessionRouter } from './routes/Session.routes.js'
import { router as userRouter } from './routes/Users.routes.js'
import { connectDB } from './config/dbConnection.js'
import { messageModel } from './dao/models/Messages.model.js'
import productService from './services/Products.service.js'
import passport from 'passport'
import initializedPassport from './config/passport.config.js'

//Configuramos los servidores
const app = express()
const port = 8080
const httpServer = app.listen(port, () => console.log(`Servidor en el puerto ${port}`))
const socketServer = new Server(httpServer)

//Inicializamos el motor
app.engine('handlebars', handlebars.engine())
app.set('views', process.cwd() + '/src/views')
app.set('view engine', 'handlebars')

connectDB()

app.use(express.static(process.cwd() + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
    session({
        store: new MongoStore({
            mongoUrl:
                'mongodb+srv://gabrielmaine14:M63691g@clustermaine.wojwmq5.mongodb.net/ecommerce?retryWrites=true&w=majority',
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        }),
        secret: 'CoderSecret',
        resave: false,
        saveUninitialized: false,
    })
)
initializedPassport()
app.use(passport.initialize())
app.use(passport.session())
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)
app.use('/api/sessions', sessionRouter)
app.use('/api/users', userRouter)

socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado')
    socket.on('message', data => {
        console.log(data)
    })
    socket.on('new-product', async data => {
        let products = await productService.getAllProducts()
        try {
            await productService.createProduct(data)
            console.log('Nuevo producto')
            products = await productService.getAllProducts()
            console.log(products)
            socket.emit('reRender-products', products)
        } catch (error) {
            console.log(error.message)
            console.log('No se pudo cargar el producto')
            socket.emit('reRender-products', products)
        }
    })
    socket.on('delete-product', async data => {
        let products = await productService.getAllProducts()
        try {
            await productService.deleteProduct(data)
            console.log('Producto borrado')
            products = await productService.getAllProducts()
            socket.emit('reRender-products', products)
        } catch (error) {
            console.log('No se pudo borrar el producto')
            socket.emit('reRender-products', products)
        }
    })
    socket.on('new-message', async data => {
        const addMessage = await messageModel.create(data)
        socket.emit('reRender-chat', addMessage)
    })
    socket.on('change-page', async data => {
        let products = await productService.paginateProducts({}, { limit: 5, page: data, lean: true })

        const results = {
            status: products.docs.length > 0 ? 'success' : 'error',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage
                ? `http://localhost:8080/api/products?limit=${products.limit}&page=${products.prevPage}`
                : null,
            nextLink: products.hasNextPage
                ? `http://localhost:8080/api/products?limit=${products.limit}&page=${products.nextPage}`
                : null,
        }

        socket.emit('reRender-page', results)
    })
})
