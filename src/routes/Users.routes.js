'use strict'

import { Router } from 'express'
import userController from '../Controllers/User.controller.js'
import { uploader } from '../middleware/uploader.middleware.js'
import { authorizeAdmin } from '../middleware/authorization.middleware.js'

const router = Router()

router.get('/', userController.getAllUsers)

router.post('/', userController.createUser)

router.delete('/', authorizeAdmin, userController.deleteUnused)

router.put('/:id', userController.updateUser)

router.delete('/:id', authorizeAdmin, userController.deleteUser)

router.put('/premium/:id', userController.premiumUser)

router.post('/apiRestorePassword', userController.restorePassword)

router.post('/apiResetPassword', userController.resetPassword)

router.post('/:id/documents', uploader.array('files'), userController.uploadDocument)

export { router }
