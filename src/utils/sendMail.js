const nodemailer = require("nodemailer");
const { configMail } = require("../config/configFile.js");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: configMail.MAIL_USER, // Gmail Adress
        pass: configMail.MAIL_PASS // Gmail Password
    },
});

// async..await is not allowed in global scope, must use a wrapper
async function mail(destinationAddress, content, domainData) {

    console.log("dest", destinationAddress);
    console.log("sender", configMail.MAIL_USER, configMail.MAIL_PASS);
    try {
        const info = await transporter.sendMail({
            from: {
                name: 'Culinária em Foco',
                address: configMail.MAIL_USER
            },
            to: destinationAddress, // Lista de destinatários
            subject: "Redefinição de senha", // Assunto
            //text: "", // Conteúdo em texto
            html: `
            <div style="font-family: Helvetica,Arial,sans-serif;overflow:auto;line-height:2;">
                <div style="margin:0px auto;width:70%;padding:20px 0;min-width: 300px;">
                    <div style="border-bottom:1px solid #eee">
                        <a href="${domainData.protocol}://${domainData.host}">
                            <img src="${domainData.protocol}://${domainData.host}/assets/images/croissant-logo.svg" alt="logo Culinária em Foco" height="28" width="auto" style="padding:0 0 10px 0;">
                        </a>
                    </div>
                    <p style="font-size:1.2em">Olá,</p>
                    <p style="font-size:1.2em">Clique no link abaixo para redefinir sua senha. O link é valido por <strong>4 minutos</strong>.
                        <br>Se você não solicitou uma redefinição de senha, por favor ignore este e-mail.
                        <br><br>Sinta-se à vontade para entrar em contato conosco para qualquer assistência.
                    </p>
                    <p style="font-size:1.2em"><strong>Link:</strong> <a style="color:#3869d4" href="${content}" target="_blank">${content}</a></p>
                    <p style="font-size:1.2em;">Atenciosamente,<br />${domainData.protocol}://${domainData.host}</p>
                </div>
            </div>
            `, // Cointeúdo em HTML
        });
        
        
        if (info.messageId) {
            console.log("Message sent: %s", info.messageId);
            const success = { success: true, message: 'E-mail enviado com sucesso!' };
            return success;
        }

    } catch (err) {
        console.error("Erro:", err);
        const error = { success: false, error: 'Erro ao enviar e-mail, contate o suporte' }
        return error;
    }

}

module.exports = { mail };
