const nodemailer = require('nodemailer')


const sendMail = async(options)=>{
   const transport =  nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.GMAIL_USER,
        pass:process.env.GMAIL_PASS
    }
   })

    const mailOptions = {
        from:`Elysium <elysium.genuine@gmail.com>`,
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transport.sendMail(mailOptions)

}

module.exports = sendMail;