import { expect } from 'chai'
import supertest from 'supertest'
import { describe, it } from 'mocha'

const url = supertest('http://localhost:8080')

describe('Test case Product Router', () => {
    let product_Id
    it('[POST] /api/products - Create a product', async () => {
        const mockProduct = {
            title: 'Titulo',
            description: 'Prueba supertest',
            price: 1000,
            code: 'Supertest',
            stock: 1000,
            category: 'Prueba',
            status: 'Disponible',
        }

        const testProduct = await url.post('/api/products/').send(mockProduct)
        //Esperamos que devuelva un 201 indicando la creación de un producto y corroboramos que tenga la propiedad _id de mongo y que el owner sea admin
        expect(testProduct.statusCode).to.be.eql(201)
        expect(testProduct._body.payload).to.have.property('_id')
        expect(testProduct._body.payload.owner).to.be.eql('admin')
        product_Id = testProduct._body.payload._id
        console.log('New product _id: ' + product_Id)
    })

    it('[GET] /api/products/:pid - Find a product', async () => {
        const testProduct = await url.get(`/api/products/${product_Id}`)
        //Esperamos que devuelva un 200 indicando que encontro el producto y corroboramos que tenga la propiedad _id de mongo
        expect(testProduct.statusCode).to.be.eql(200)
        expect(testProduct._body.payload).to.have.property('_id')
    })

    it('[PUT] /api/products/:pid - Update a product', async () => {
        const mockProduct = {
            status: 'No_disponible',
        }

        const testProduct = await url.put(`/api/products/${product_Id}`).send(mockProduct)
        //Esperamos que devuelva un 200 indicando que encontro y modifico el producto y que la propiedad status haya sido modificada
        expect(testProduct.statusCode).to.be.eql(200)
        expect(testProduct._body.payload.status).to.be.eql(mockProduct.status)
    })

    it('[DELETE] /api/products/:pid - Delete a product', async () => {
        const testProduct = await url.delete(`/api/products/${product_Id}`)
        //Esperamos que devuelva un 200 indicando que encontro y elimino el producto
        expect(testProduct.statusCode).to.be.eql(200)
    })

    it('[GET] /api/products/:pid - Find a deleted product', async () => {
        const testProduct = await url.get(`/api/products/${product_Id}`)
        //Esperamos que devuelva un 404 indicando que NO encontro el producto
        expect(testProduct.statusCode).to.be.eql(404)
    })
})
