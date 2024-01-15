import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { __dirname } from '../../helpers/utils.js'

const TICKETS_FILE_PATH = path.join(__dirname, '..', 'data', 'tickets.json')

export default class Tickets {
    constructor() {}

    getAll = async () => {
        try {
            const data = await fs.promises.readFile(TICKETS_FILE_PATH, 'utf-8')
            const tickets = JSON.parse(data)
            return tickets
        } catch (error) {
            console.error('Error reading tickets file:', error.message)
            return []
        }
    }

    getById = async id => {
        const tickets = await this.getAll()
        const ticket = tickets.find(ticket => ticket._id === id)
        return ticket
    }

    getByCode = async code => {
        const tickets = await this.getAll()
        const ticket = tickets.find(ticket => ticket.code === code)
        return ticket
    }

    create = async data => {
        try {
            const tickets = await this.getAll()
            const newTicket = { _id: uuidv4(), ...data }
            tickets.push(newTicket)
            await fs.promises.writeFile(TICKETS_FILE_PATH, JSON.stringify(tickets, null, 2), 'utf-8')
            return newTicket
        } catch (error) {
            console.error('Error creating ticket:', error.message)
            return null
        }
    }

    delete = async id => {
        try {
            let tickets = await this.getAll()
            const deletedTicket = tickets.find(ticket => ticket._id === id)
            tickets = tickets.filter(ticket => ticket._id !== id)
            await fs.promises.writeFile(TICKETS_FILE_PATH, JSON.stringify(tickets, null, 2), 'utf-8')
            return deletedTicket
        } catch (error) {
            console.error('Error deleting ticket:', error.message)
            return null
        }
    }
}
