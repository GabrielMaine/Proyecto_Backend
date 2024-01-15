import mongoose from 'mongoose'

const usersCollection = 'users' //Nombre de la coleccion

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
})

export const userModel = mongoose.model(usersCollection, userSchema)
