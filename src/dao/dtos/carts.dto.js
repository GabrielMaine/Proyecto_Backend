export default class CartDTO {
    constructor(payload) {
        (this._id = payload._id), (this.products = payload.products || [])
    }
}
