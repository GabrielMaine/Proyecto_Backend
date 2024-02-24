import { expect } from 'chai'
import supertest from 'supertest'
import { describe, it } from 'mocha'

const url = supertest('http://localhost:8080')

describe('Test Case Session Router', () => {
    let cookie

    it('[POST] /api/sessions/register - Sign up a user', async () => {
        const mockUser = {
            first_name: 'User',
            last_name: 'Test',
            email: 'supertest@test.com',
            age: 50,
            password: 'psw',
        }

        const testUser = await url.post('/api/sessions/register').send(mockUser)
        console.log('Status: ' + testUser.statusCode)
        expect(testUser.statusCode).to.be.eql(201)
    })

    it('[POST] /api/sessions/login - Login up a user', async () => {
        const mockUserCredentials = {
            email: 'supertest@test.com',
            password: 'psw',
        }

        const testUser = await url.post('/api/sessions/login').send(mockUserCredentials)
        expect(testUser.headers).to.have.property('set-cookie')
        const cookieHeader = testUser.headers['set-cookie'][0]
        expect(cookieHeader).to.be.ok
        cookie = {
            name: cookieHeader.split('=')[0],
            value: cookieHeader.split('=')[1],
        }
        expect(cookie.name).to.be.ok.and.eql('coderCookie')
    })

    it('[GET] /api/sessions/current - Check a logged user', async () => {
        const response = await url.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`])

        console.log(response.body)

        expect(response.statusCode).to.equal(200)
        expect(response.body).to.have.property('status', 'success')
        expect(response.body.payload.email).to.equal('supertest@test.com')
    })
})
