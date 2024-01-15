import config from '../config/config.js'

let userDAO, productDAO, cartDAO, ticketDAO

switch (config.persistence) {
    case 'MONGO': {
        try {
            const { default: Users } = await import('./mongo/users.mongo.js')
            userDAO = new Users()
            const { default: Carts } = await import('./mongo/carts.mongo.js')
            cartDAO = new Carts()
            const { default: Products } = await import('./mongo/products.mongo.js')
            productDAO = new Products()
            const { default: Tickets } = await import('./mongo/tickets.mongo.js')
            ticketDAO = new Tickets()
        } catch (error) {
            console.log('Error during MongoDB module import', error)
            throw new Error('Failed to initialize MongoDB DAOs')
        }
        break
    }

    case 'MEMORY': {
        try {
            const { default: Users } = await import('./fs/users.file.js')
            userDAO = new Users()
            const { default: Carts } = await import('./fs/carts.file.js')
            cartDAO = new Carts()
            const { default: Products } = await import('./fs/products.file.js')
            productDAO = new Products()
            const { default: Tickets } = await import('./fs/tickets.file.js')
            ticketDAO = new Tickets()
        } catch (error) {
            console.log('Error during Memory module import', error)
            throw new Error('Failed to initialize Memory DAOs')
        }
        break
    }

    default: {
        throw new Error('Please provide a valid persistence')
    }
}

const getDAOS = () => {
    return {
        userDAO,
        productDAO,
        cartDAO,
        ticketDAO,
    }
}

export default getDAOS
