//Definimos una clase Product para los elementos que cargamos al Product Manager
class Product {
    constructor(title, description, price, code, status = true, stock, category, id = 0) {
        this.title = title
        this.description = description
        this.price = price
        this.code = code
        this.status = status
        this.stock = stock
        this.category = category
        this.id = id
    }
}

export default Product
