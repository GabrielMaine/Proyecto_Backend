'use strict'

import ProductManager from '../dao/fs/ProductManager.js'
import CartManager from '../dao/fs/CartManager.js'

//Creamos una variable product vinculada al archivo Productos.json
export let product = new ProductManager('./src/Productos.json')
//Creamos una variable carts vinculada al archivo Carritos.json
export let carts = new CartManager('./src/Carritos.json')
