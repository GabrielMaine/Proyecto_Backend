export default class TicketDTO {
    constructor(payload) {
        (this._id = payload._id),
            (this.code = payload.code),
            (this.purchase_datetime = payload.purchase_datetime),
            (this.amount = payload.amount),
            (this.purchaser = payload.purchaser)
    }
}
