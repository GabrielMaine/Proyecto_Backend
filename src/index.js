'use strict'

//Importamos express y las rutas de los productos y de los carritos

import express from 'express'
import { router as productRouter } from './routes/Product.routes.js'
import { router as cartRouter } from './routes/Cart.routes.js'

const app = express()
app.listen(8080, () => console.log('Servidor en el puerto 8080'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
