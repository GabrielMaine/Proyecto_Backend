'use strict'

import { Router } from 'express'
import userController from '../Controllers/User.controller.js'

const router = Router()

router.get('/', userController.getAllUsers)

router.post('/', userController.createUser)

router.put('/:id', userController.updateUser)

export { router }
