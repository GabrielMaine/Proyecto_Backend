'use strict'

import ProductManager from './dao/ProductManager.js'
import CartManager from './dao/CartManager.js'

//Creamos una variable product vinculada al archivo Productos.json
export let product = new ProductManager('./src/Productos.json')
//Creamos una variable carts vinculada al archivo Carritos.json
export let carts = new CartManager('./src/Carritos.json')
