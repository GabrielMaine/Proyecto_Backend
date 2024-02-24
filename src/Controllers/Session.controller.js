import UserSensibleDTO from '../dao/dtos/users.sensible.dto.js'

class sessionController {
    async register(req, res) {
        res.status(201).send({ status: 'success', payload: req.user })
    }

    async failRegister(req, res) {
        res.status(400).send({ error: 'Register error' })
    }

    async login(req, res) {
        const { email, password } = req.body
        if (!req.user || !email || !password)
            return res.status(400).send({ status: 'error', error: 'Incomplete Values' })
        let isAdmin = req.user.role === 'admin' ? true : false
        req.session.user = {
            name: req.user.first_name + ' ' + req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role,
            isAdmin: isAdmin,
        }
        res.send({ status: 'success', payload: req.user })
    }

    async failLogin(req, res) {
        res.send({ error: 'failed' })
    }

    async logout(req, res) {
        req.session.destroy(err => {
            if (!err) {
                res.redirect('/login')
            } else {
                res.status(400).send({ status: 'Logout error', message: err })
            }
        })
    }

    async github(req, res) {}

    async githubCallback(req, res) {
        req.session.user = req.user
        res.redirect('/')
    }

    async current(req, res) {
        try {
            const cookie = req.cookies['coderCookie']
            if (cookie) {
                req.session.user = req.user
                const payload = new UserSensibleDTO(req.session.user)
                res.status(200).send({ status: 'success', payload: payload })
            } else {
                res.status(400).send({ status: 'Not found', message: 'No current session' })
            }
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }
}

export default new sessionController()
