import passport from 'passport'
import local from 'passport-local'
import { isValidPassword } from '../helpers/utils.js'
import usersRepository from '../repositories/users.repository.js'
import GithubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy

const initializedPassport = () => {
    passport.use(
        'github',
        new GithubStrategy(
            {
                clientID: 'Iv1.004b171be90c8e1d',
                clientSecret: '0386521d250d7392f06a73944ed9842b3f9ecca8',
                callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await usersRepository.getByEmail(profile._json.email)
                    let result = user
                    if (!user) {
                        let newUser = {
                            first_name: profile._json.name,
                            last_name: '',
                            email: profile._json.email,
                            age: '',
                            password: '',
                        }
                        result = await usersRepository.create(newUser)
                    }
                    return done(null, result)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        'register',
        new LocalStrategy(
            { passReqToCallback: true, usernameField: 'email' },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, email, age } = req.body
                    const user = await usersRepository.getByEmail(email)
                    if (user) {
                        return done(null, false)
                    }
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password,
                    }
                    let result = await usersRepository.create(newUser)
                    return done(null, result)
                } catch (error) {
                    return done('User Not fount' + error)
                }
            }
        )
    )

    passport.use(
        'login',
        new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
            try {
                const user = await usersRepository.getByEmail(email)
                if (!user) {
                    return done(null, false)
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false)
                }
                return done(null, user)
            } catch (error) {
                return done(null, false)
            }
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await usersRepository.getById(id)
        done(null, user)
    })
}

export default initializedPassport
