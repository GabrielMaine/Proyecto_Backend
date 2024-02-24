import mongoose from 'mongoose'
import config from '../src/config/config.js'
import userModel from '../src/dao/mongo/models/Users.model.js'
import Mocha from 'mocha'

// before(async()=>{
//     await mongoose.connect(config.mongoUrl)
// })

// after(async()=>{
//     mongoose.connection.close()
// })

// export const dropUser = async () =>{
//     await userModel.collection.drop()
// }
