import passport from 'passport'
import local from 'passport-local'
import { createHash, isValidPassword } from '../utils.js'
import { userModel } from '../dao/models/Users.model.js'
import { cartModel } from '../dao/models/Carts.model.js'
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
                    let user = await userModel.findOne({ email: profile._json.email })
                    let result = user
                    if (!user) {
                        let newCart = await cartModel.create({ products: [] })
                        console.log(newCart)
                        let newUser = {
                            first_name: profile._json.name,
                            last_name: '',
                            email: profile._json.email,
                            age: '',
                            password: '',
                            cart: newCart._id,
                        }
                        result = await userModel.create(newUser)
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
                const { first_name, last_name, email, age } = req.body
                try {
                    const user = await userModel.findOne({ email: username })
                    if (user) {
                        console.log(user)
                        return done(null, false)
                    }
                    let newCart = await cartModel.create({ products: [] })
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        cart: newCart._id,
                    }
                    let result = await userModel.create(newUser)
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
                const user = await userModel.findOne({ email: email })
                console.log(' User login ' + user)
                if (!user) {
                    console.log('No user')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.log('invalid password')
                    return done(null, false)
                }

                return done(null, user)
            } catch (error) {
                return done(null, false)
            }
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializedPassport
