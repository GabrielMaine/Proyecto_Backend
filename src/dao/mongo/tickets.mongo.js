import { ticketModel } from './models/Tickets.model.js'

export default class Tickets {
    constructor() {}

    getAll = async () => {
        let tickets = await ticketModel.find().lean()
        return tickets
    }

    getById = async id => {
        let ticket = await ticketModel.findById(id).lean()
        return ticket
    }

    getByCode = async code => {
        let ticket = await ticketModel.findOne({ code }).lean()
        return ticket
    }

    create = async data => {
        let ticket = await ticketModel.create(data)
        return ticket
    }

    delete = async id => {
        let ticket = await ticketModel.findByIdAndDelete(id)
        return ticket
    }
}
