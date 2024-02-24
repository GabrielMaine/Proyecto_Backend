import { expect } from 'chai'
import supertest from 'supertest'
import { describe, it, before } from 'mocha'

const url = supertest('http://localhost:8080')

describe('Test Case Cart Router', () => {
    let cart_Id

    let product1 = {
        id: '654a7a1a61487a31f0a2f5c2',
    }

    let product2 = {
        id: '654a7a3b61487a31f0a2f5c4',
    }

    before('[GET] /api/products/:pid - Find a product', async () => {
        const testProduct = await url.get(`/api/products/${product2.id}`)
        //Esperamos que devuelva un 200 indicando que encontro el producto
        expect(testProduct.statusCode).to.be.eql(200)
        //Almacenamos el stock del producto 2 para utilizarlo en el test de compra
        product2.stock = testProduct._body.payload.stock
    })

    it('[POST] /api/carts - Create a cart', async () => {
        const testCart = await url.post('/api/carts/')
        //Esperamos que devuelva un 201 indicando la creación del carrito
        expect(testCart.statusCode).to.be.eql(201)
        //corroboramos que tenga la propiedad _id de mongo
        expect(testCart._body.payload).to.have.property('_id')
        //Corroboramos que se haya creado vacio
        expect(testCart._body.payload.products).to.be.eql([])
        //Guardamos el id del carrito para futuras pruebas
        cart_Id = testCart._body.payload._id
        console.log('New cart _id: ' + cart_Id)
    })

    it('[GET] /api/carts/:cid - Find a cart', async () => {
        const testCart = await url.get(`/api/carts/${cart_Id}`)
        //Esperamos que devuelva un 200 indicando que encontro el producto
        expect(testCart.statusCode).to.be.eql(200)
        //corroboramos que tenga la propiedad _id de mongo
        expect(testCart._body.payload).to.have.property('_id')
        //Corroboramos que siga vacio
        expect(testCart._body.payload.products).to.be.eql([])
    })

    it('[POST] /api/carts/:cid/product/:pid - Add first product to cart', async () => {
        const testCart = await url.post(`/api/carts/${cart_Id}/product/${product1.id}`)
        // Esperamos que devuelva un 200 indicando que pudo agregar una unidad del producto al carro
        expect(testCart.statusCode).to.be.eql(200)
        // Verificamos si se ha creado un objeto en la lista de productos del carrito
        expect(testCart._body.payload.products.length).to.be.above(0)
        // Buscamos el producto en la lista de productos del carrito
        const addedProduct = testCart._body.payload.products.find(product => product.product === product1.id)
        // Verificamos si se encontró el producto en el carrito
        expect(addedProduct).to.exist
        // Verificamos si el producto tiene la propiedad 'product' igual a 'productId'
        expect(addedProduct.product).to.be.eql(product1.id)
    })

    it('[POST] /api/carts/:cid/product/:pid - Add first product to cart again', async () => {
        const testCart = await url.post(`/api/carts/${cart_Id}/product/${product1.id}`)
        // Esperamos que devuelva un 200 indicando que pudo agregar una unidad del producto al carro
        expect(testCart.statusCode).to.be.eql(200)
        // Buscamos el producto en la lista de productos del carrito
        const addedProduct = testCart._body.payload.products.find(product => product.product === product1.id)
        // Verificamos si se encontró el producto en el carrito
        expect(addedProduct).to.exist
        // Verificamos si el producto tiene la propiedad 'product' igual a 'productId'
        expect(addedProduct.product).to.be.eql(product1.id)
        //Verificamos que la propiedad quantity del producto sea igual a 2, es decir que se haya sumado una nueva unidad al carrito
        expect(addedProduct.quantity).to.be.eql(2)
    })

    it('[POST] /api/carts/:cid/product/:pid - Add second product to cart', async () => {
        const testCart = await url.post(`/api/carts/${cart_Id}/product/${product2.id}`)
        // Esperamos que devuelva un 200 indicando que pudo agregar una unidad del producto al carro
        expect(testCart.statusCode).to.be.eql(200)
        // Buscamos el producto en la lista de productos del carrito
        const addedProduct = testCart._body.payload.products.find(product => product.product === product2.id)
        // Verificamos si se encontró el producto en el carrito
        expect(addedProduct).to.exist
        // Verificamos si el producto tiene la propiedad 'product' igual a 'productId'
        expect(addedProduct.product).to.be.eql(product2.id)
        //Verificamos que la propiedad quantity del producto sea igual a 1, es decir que se haya sumado una nueva unidad al carrito
        expect(addedProduct.quantity).to.be.eql(1)
    })

    it('[DELETE] /api/carts/:cid - Empty cart', async () => {
        const testCart = await url.delete(`/api/carts/${cart_Id}`)
        // Esperamos que devuelva un 200 indicando que pudo limpiar el carrito
        expect(testCart.statusCode).to.be.eql(200)
        // Corroboramos que se haya vaciado
        expect(testCart._body.payload.products).to.be.eql([])
    })

    it('[POST] /api/carts/:cid/product/:pid - Re add first product to cart', async () => {
        const testCart = await url.post(`/api/carts/${cart_Id}/product/${product1.id}`)
        // Esperamos que devuelva un 200 indicando que pudo agregar una unidad del producto al carro
        expect(testCart.statusCode).to.be.eql(200)
        // Verificamos si se ha creado un objeto en la lista de productos del carrito
        expect(testCart._body.payload.products.length).to.be.above(0)
        // Buscamos el producto en la lista de productos del carrito
        const addedProduct = testCart._body.payload.products.find(product => product.product === product1.id)
        // Verificamos si se encontró el producto en el carrito
        expect(addedProduct).to.exist
        // Verificamos si el producto tiene la propiedad 'product' igual a 'productId'
        expect(addedProduct.product).to.be.eql(product1.id)
        //Verificamos que la propiedad quantity del producto sea igual a 2, es decir que se haya sumado una nueva unidad al carrito
        expect(addedProduct.quantity).to.be.eql(1)
    })

    it('[DELETE] /api/carts/:cid/product/:pid - Remove first product of cart', async () => {
        const testCart = await url.delete(`/api/carts/${cart_Id}/product/${product1.id}`)
        // Esperamos que devuelva un 200 indicando que pudo eliminar el producto del carrito
        expect(testCart.statusCode).to.be.eql(200)
        // Corroboramos que haya quedado vacio
        expect(testCart._body.payload.products).to.be.eql([])
    })

    it('[POST] /api/carts/:cid/product/:pid - Re add second product to cart', async () => {
        const testCart = await url.post(`/api/carts/${cart_Id}/product/${product2.id}`)
        // Esperamos que devuelva un 200 indicando que pudo agregar una unidad del producto al carro
        expect(testCart.statusCode).to.be.eql(200)
        // Verificamos si se ha creado un objeto en la lista de productos del carrito
        expect(testCart._body.payload.products.length).to.be.above(0)
        // Buscamos el producto en la lista de productos del carrito
        const addedProduct = testCart._body.payload.products.find(product => product.product === product2.id)
        // Verificamos si se encontró el producto en el carrito
        expect(addedProduct).to.exist
        // Verificamos si el producto tiene la propiedad 'product' igual a 'productId'
        expect(addedProduct.product).to.be.eql(product2.id)
        //Verificamos que la propiedad quantity del producto sea igual a 2, es decir que se haya sumado una nueva unidad al carrito
        expect(addedProduct.quantity).to.be.eql(1)
    })

    it('[PUT] /api/carts/:cid/product/:pid - Update second product quantity', async () => {
        const mockBody = { quantity: 20 }

        const testCart = await url.put(`/api/carts/${cart_Id}/product/${product2.id}`).send(mockBody)
        // Esperamos que devuelva un 200 indicando que pudo modificar la cantidad del producto 2 en el carrito
        expect(testCart.statusCode).to.be.eql(200)
        // Buscamos el producto en la lista de productos del carrito
        const addedProduct = testCart._body.payload.products.find(product => product.product === product2.id)
        // Verificamos si se encontró el producto en el carrito
        expect(addedProduct).to.exist
        // Verificamos si el producto tiene la propiedad 'product' igual a 'productId'
        expect(addedProduct.product).to.be.eql(product2.id)
        //Verificamos que la propiedad quantity del producto sea igual a la enviada por body
        expect(addedProduct.quantity).to.be.eql(mockBody.quantity)
    })

    it('[GET] /api/carts/:cid/purchase - Buy a cart', async () => {
        const testCart = await url.get(`/api/carts/${cart_Id}/purchase`)
        console.log('Stock: ' + product2.stock)
        //Si tenemos suficiente stock para realizar la compra esperamos que se realice sin problemas
        if (product2.stock >= 20) {
            // Esperamos que devuelva un 200 indicando que se realizo la compra
            expect(testCart.statusCode).to.be.eql(200)
            // El monto de compra debe ser mayor a cero
            expect(testCart._body.payload.ticket.amount).to.be.greaterThan(0)
            // Como se compro el carrito entero esperamos que este termine vacio
            expect(testCart._body.payload.cart.products).to.be.eql([])
        } else {
            // Al no haber stock suficiente la compra no debe realizarse
            expect(testCart.statusCode).to.be.eql(400)
        }
    })
})
