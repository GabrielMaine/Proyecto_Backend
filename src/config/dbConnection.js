import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://gabrielmaine14:M63691g@clustermaine.wojwmq5.mongodb.net/ecommerce?retryWrites=true&w=majority'
        )
        console.log('Base de datos conectada correctamente')
    } catch (error) {
        console.log(`Error al conectar con la base de datos ${error.message}`)
    }
}
