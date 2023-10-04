'use strict'

import { productGetter, productGetterById, productAdder, productUpdater, productDeleter } from '../ProductController.js'
import { Router } from 'express'

const router = Router()

//Rutas del catalogo

router.get('', productGetter)

router.get('/:pid', productGetterById)

router.post('', productAdder)

router.put('/:pid', productUpdater)

router.delete('/:pid', productDeleter)

export { router }
