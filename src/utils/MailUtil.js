const mailer =  require('nodemailer');

const userSendingMail = async(to,subject,text)=>{

    const transporter = mailer.createTransport({
        service:"gmail",
        auth:{
            user:"veerraar325@gmail.com",
            pass:"cxro obte apmi dmsm"
        }
    })

    const mailOptions = {
        from:"veerraar325@gmail.com",
        to:to,
        subject:subject,
        text:text
    }

    const mailresponse = await transporter.sendMail(mailOptions) ;
    console.log(mailresponse);
    return mailresponse
};

const businessSendingMail = async(to,subject,text)=>{

    const transporter = mailer.createTransport({
        service:"gmail",
        auth:{
            user:"veerraar325@gmail.com",
            pass:"cxro obte apmi dmsm"
        }
    })

    const mailOptions = {
        from:"veerraar325@gmail.com",
        to:to,
        subject:subject,
        text:text
    }

    const mailresponse = await transporter.sendMail(mailOptions) ;
    console.log(mailresponse);
    return mailresponse
};

const contactUsSendingMail = async(to,subject,text)=>{

    const transporter = mailer.createTransport({
        service:"gmail",
        auth:{
            user:"veerraar325@gmail.com",
            pass:"cxro obte apmi dmsm"
        }
    })

    const mailOptions = {
        from:"veerraar325@gmail.com",
        to:to,
        subject:subject,
        text:text
    }

    const mailresponse = await transporter.sendMail(mailOptions) ;
    console.log(mailresponse);
    return mailresponse
};

const forgotSendingMail = async(to,subject,text)=>{

    const transporter = mailer.createTransport({
        service:"gmail",
        auth:{
            user:"veerraar325@gmail.com",
            pass:"cxro obte apmi dmsm"
        }
    })

    const mailOptions = {
        from:"veerraar325@gmail.com",
        to:to,
        subject:subject,
        html:text
    }

    const mailResponse = await transporter.sendMail(mailOptions) ;
    console.log(mailResponse);
    return mailResponse
}

module.exports ={
    userSendingMail,forgotSendingMail,businessSendingMail,contactUsSendingMail
}