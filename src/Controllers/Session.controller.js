class sessionController {
    async register(req, res) {
        res.send({ status: 'success', message: 'User registered' })
    }

    async failRegister(req, res) {
        res.send({ error: 'failed' })
    }

    async login(req, res) {
        const { email, password } = req.body
        if (!req.user) return res.status(400).send({ status: 'error', error: 'Incomplete Values' })

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
        req.session.user = req.user
        console.log('Estoy en current')
        if (req.session.user) {
            res.status(200).send({ status: 'Sucess', message: req.session.user })
        } else {
            res.status(400).send({ status: 'Not found', message: 'No current session' })
        }
    }
}

export default new sessionController()
