'use strict'

import express from 'express'
import compression from 'express-compression'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'
import { router as productRouter } from './routes/Product.routes.js'
import { router as cartRouter } from './routes/Cart.routes.js'
import { router as viewsRouter } from './routes/Views.routes.js'
import { router as sessionRouter } from './routes/Session.routes.js'
import { router as userRouter } from './routes/Users.routes.js'
import { connectDB } from './config/dbConnection.js'
import passport from 'passport'
import initializedPassport from './config/passport.config.js'
import errorHandler from './services/errors/index.js'
import { generateLogger } from './helpers/logger/logger.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import { __dirname } from './helpers/utils.js'
import cookieParser from 'cookie-parser'

//Configuramos los servidores
const app = express()
const port = process.env.PORT || 8080
const httpServer = app.listen(port, () => console.log(`Servidor en el puerto ${port}`))

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Minimarket 24',
            description: 'Tienda online 24hs',
        },
    },
    apis: ['./src/docs/**/*.yaml'],
}
const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//Inicializamos el motor
app.engine('handlebars', handlebars.engine())
app.set('views', process.cwd() + '/src/views')
app.set('view engine', 'handlebars')

connectDB()

app.use(express.static(process.cwd() + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    compression({
        brotli: { enabled: true, zlib: {} },
    })
)
app.use(errorHandler)
app.use(generateLogger)
app.use(cookieParser())
app.use(
    session({
        store: new MongoStore({
            mongoUrl:
                'mongodb+srv://gabrielmaine14:M63691g@clustermaine.wojwmq5.mongodb.net/ecommerce?retryWrites=true&w=majority',
            // mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        }),
        secret: 'CoderSecret',
        resave: false,
        saveUninitialized: false,
        name: 'coderCookie',
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
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
