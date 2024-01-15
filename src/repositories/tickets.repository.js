import getDAOS from '../dao/factory.js'
import TicketDTO from '../dao/dtos/tickets.dto.js'

const { ticketDAO } = getDAOS()
class TicketRepository {
    constructor() {
        this.dao = ticketDAO
    }

    async getAll() {
        let result = await this.dao.getAll()
        return result
    }

    async getById(id) {
        let result = await this.dao.getById(id)
        return result
    }

    async getByCode(code) {
        let result = await this.dao.getByCode(code)
        return result
    }

    async create(payload) {
        const data = new TicketDTO(payload)
        let result = await this.dao.create(data)
        return result
    }

    async delete(id) {
        let result = await this.dao.delete(id)
        return result
    }
}

export default new TicketRepository()
