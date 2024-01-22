export const generateUserErrorInfo = user => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    *first_name: needs to be string, recieved ${user.first_name}
    *last_name: needs to be string, recieved ${user.last_name}
    *email: needs to be string, recieved ${user.email}`
}

export const generateProductErrorInfo = product => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    *title: needs to be string, recieved ${product.title}
    *description: needs to be string, recieved ${product.description}
    *price: needs to be number, recieved ${product.price}
    *code: needs to be string and unique, recieved ${product.code}
    *stock: needs to be number, recieved ${product.stock}
    *category: needs to be number, recieved ${product.category}`
}
