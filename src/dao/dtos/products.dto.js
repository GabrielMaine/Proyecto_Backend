export default class ProductDTO {
    constructor(payload) {
        (this._id = payload._id),
            (this.title = payload.title),
            (this.description = payload.description),
            (this.price = payload.price),
            (this.thumbnail = payload.thumbnail || ''),
            (this.code = payload.code),
            (this.stock = payload.stock),
            (this.category = payload.category),
            (this.status = payload.status)
    }
}
