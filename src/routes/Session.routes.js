import { Router } from 'express'
import { userModel } from '../dao/models/Users.model.js'

const router = Router()

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body
    console.log('Registrando usuario')
    const existe = await userModel.findOne({ email })

    if (existe) return res.status(400).send({ status: 'error', error: 'El usuario ya existe' })
    const user = {
        first_name,
        last_name,
        email,
        age,
        password,
    }
    let result = await userModel.create(user)

    res.send({ status: 'success', message: 'usuario registrado' })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    console.log('Si pase por aqui /////')
    const user = await userModel.findOne({ email, password })

    if (!user) return res.status(400).send({ status: 'error', error: 'Error Credentials' })

    let isAdmin = user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123' ? true : false

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: isAdmin ? 'Admin' : 'User',
        isAdmin: isAdmin,
    }
    res.send({ status: 'success', payload: req.session.user, message: 'Primer Logueo' })
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.redirect('/login')
        } else {
            res.status(400).send({ status: 'Logout error', message: err })
        }
    })
})

export { router }
