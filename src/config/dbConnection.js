import mongoose from 'mongoose'
import config from './config.js'

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl)
        console.log('Base de datos conectada correctamente')
    } catch (error) {
        console.log(`Error al conectar con la base de datos ${error.message}`)
    }
}
