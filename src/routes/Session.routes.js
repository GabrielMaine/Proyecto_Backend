import { Router } from 'express'
import passport from 'passport'
import sessionController from '../Controllers/Session.controller.js'

const router = Router()

router.post(
    '/register',
    passport.authenticate('register', {
        failureRedirect: '/failregister',
    }),
    sessionController.register
)

router.get('/failregister', sessionController.failRegister)

router.post(
    '/login',
    passport.authenticate('login', {
        failureRedirect: '/faillogin',
    }),
    sessionController.login
)

router.get('/faillogin', sessionController.failLogin)

router.get('/logout', sessionController.logout)

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), sessionController.github)

router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    sessionController.githubCallback
)

router.get('/current', sessionController.current)

export { router }
