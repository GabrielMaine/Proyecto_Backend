import mailer from 'nodemailer'
import config from '../../config/config.js'

export default class MailingService {
    constructor() {
        this.client = mailer.createTransport({
            service: config.mailing.service,
            port: 587,
            secure: true,
            auth: {
                user: config.mailing.user,
                pass: config.mailing.password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        })
    }

    sendMailUser = async ({ from, to, subject, html, attachments = [] }) => {
        try {
            let result = await this.client.sendMail({
                from,
                to,
                subject,
                html,
                attachments,
            })
            return result
        } catch (error) {
            console.error('Error sending email:', error)
            throw error
        }
    }
}
