const nodemailer = require('nodemailer')

class MailService {

    // Create nodemailer transporter example
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {pass: process.env.SMTP_PASSWORD, user: process.env.SMTP_USER} // Mail credentials
        })

    }

    // Send confirmation email letter using transporter credentials
    async sendActivationMail(mail, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: mail,
            subject: `Account activation on ${process.env.API_URL}`,
            text: ' ',
            html: `<div><h1>Confirm Email</h1><a href="${link}">${link}</a></div>`
        }).then(result => console.log(result.response)).catch(error => console.log(error.response))
    }

    // Send confirmation email letter using transporter credentials
    async sendInformationMail(mail, userName) {
        let message = 'System has detected a user currently working under you credentials!';
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: mail,
            subject: `SPA SERVER notification on ${process.env.API_URL}`,
            text: ' ',
            html: `<div><br/><p>Hi ${userName}!</p><br><p>${message}</p><br><p>SPA SERVER Developer Team</p></div>`
        }).then(result => console.log(result.response)).catch(error => console.log(error.response))
    }
}

module.exports = new MailService();