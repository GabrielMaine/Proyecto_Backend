'use strict'

import { Router } from 'express'
import { userModel } from '../dao/models/Users.model.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const users = await userModel.find()
        res.json({ status: 'Success', data: users })
    } catch (error) {
        console.log(error.message)
        res.json({ status: 'Error', message: 'No se pudo encontrar la lista de usuarios' })
    }
})

router.post('/', async (req, res) => {
    try {
        const userInfo = req.body
        const userCreated = await userModel.create(userInfo)
        res.json({ status: 'Success', data: userCreated })
    } catch (error) {
        console.log(error.message)
        res.json({ status: 'Error', message: 'No se pudo crear el usuario' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const userId = req.params
        const userReplace = req.body
        const userUpdate = await userModel.updateOne({ _id: userId.id }, userReplace)
        res.json({ status: 'Success', data: userUpdate })
    } catch (error) {
        console.log(error.message)
        res.json({ status: 'Error', message: 'No se pudo actualizar el usuario' })
    }
})

export { router }
