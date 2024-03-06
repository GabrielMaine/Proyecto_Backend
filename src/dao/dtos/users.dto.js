export default class UserDTO {
    constructor(payload) {
        (this._id = payload._id),
            (this.first_name = payload.first_name),
            (this.last_name = payload.last_name),
            (this.email = payload.email),
            (this.age = payload.age),
            (this.password = payload.password),
            (this.cart = payload.cart),
            (this.role = payload.role),
            (this.token = payload.token),
            (this.expiration = payload.expiration),
            (this.documents = payload.documents),
            (this.last_connection = payload.last_connection)
    }
}
