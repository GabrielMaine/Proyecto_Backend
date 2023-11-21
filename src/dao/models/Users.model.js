import mongoose from 'mongoose'

const usersCollection = 'users' //Nombre de la coleccion

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
})

export const userModel = mongoose.model(usersCollection, userSchema)
