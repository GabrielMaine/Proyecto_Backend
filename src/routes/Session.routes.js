import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.post(
    '/register',
    passport.authenticate('register', {
        failureRedirect: '/failregister',
    }),
    async (req, res) => {
        res.send({ status: 'success', message: 'User registered' })
    }
)

router.get('/failregister', async (req, res) => {
    res.send({ error: 'failed' })
})

router.post(
    '/login',
    passport.authenticate('login', {
        failureRedirect: '/faillogin',
    }),
    async (req, res) => {
        const { email, password } = req.body
        if (!req.user) return res.status(400).send({ status: 'error', error: 'Incomplete Values' })

        let isAdmin = req.user.email === 'adminCoder@coder.com' ? true : false

        req.session.user = {
            name: req.user.first_name + ' ' + req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: isAdmin ? 'Admin' : 'User',
            isAdmin: isAdmin,
        }

        res.send({ status: 'success', payload: req.user })
    }
)

router.get('/faillogin', async (req, res) => {
    res.send({ error: 'failed' })
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

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user
    res.redirect('/')
})

export { router }
