import dotenv from 'dotenv'

dotenv.config()

export default {
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    persistence: process.env.PERSISTENCE,
    enviroment: process.env.ENVIROMENT,
}
