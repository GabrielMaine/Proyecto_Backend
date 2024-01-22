import { faker } from '@faker-js/faker'
import ProductDTO from '../dao/dtos/products.dto.js'

export const generateProduct = () => {
    let data = {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.string.uuid(),
        stock: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
        category: faker.commerce.department(),
        status: faker.helpers.weightedArrayElement([
            { weight: 9, value: 'Disponible' },
            { weight: 1, value: 'No_disponible' },
        ]),
    }

    let product = new ProductDTO(data)

    return product
}
