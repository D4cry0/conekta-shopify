import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

export class GHandler {
    
    prepararEmailBody( clink, isCash ){

        return `<h1> STORE NAME - Conekta </h1>
        <h2> ${ isCash ? 'OXXO PAY' : 'Transferencia' } </h2>
        <br />
        <p> ${isCash ? `<h3>Sigue estas recomendaciones:</h3>
                        <br />1.- Con el enlace genera la referencia numérica.
                        <br />2.- Entréga la referencia al cajero del OXXO indícale que es un pago por OXXO PAY.
                        <br /><b><font color="#C70039">3.- Para aplicar el pago responde este correo anexando el comprobante de pago.</font></b>` 
                     : `<h3>Sigue estas recomendaciones:</h3>
                        <br />1.- Con el enlace genera la referencia numérica.
                        <br />2.- La referencia generada es a la CLABE interbancaria.
                        <br />3.- El beneficiario es STORE NAME.
                        <br />4.- El banco es STP.
                        <br />5.- Ya que la CLABE cambia con el tiempo no recomendamos guardar la cuenta en tu app.
                        <br /><b><font color="#C70039">6.- Para aplicar el pago responde este correo anexando el comprobante de pago.</font></b>`} </p>
        <br />
        <a href="${ clink }" target="_blank">ENLACE DE PAGO</a>
        <br />
        <br />
        <p><b> El enlace de pago caduca en 48 Horas. </b></p>     
        <p><b> Confirmaremos tu pago dentro de nuestro horario hábil. </b></p>`

    }

    async crearTransporter() {
    
        const oauth2Cliente = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );
        
        oauth2Cliente.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        });
    
        // Se creo con promesa porque no soporta un async - await
        const accessToken = await new Promise(( res, rej ) => {
            oauth2Cliente.getAccessToken(( err, token ) => {
    
                if( err ) rej('No se genero el token');
    
                res(token);
    
            });
        });
    
        // EL transportador nos va servir para enviar los correos
        const transportador = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL,
                accessToken,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN
            }
        });
    
        return transportador;
    };

    // datos es un objeto con las opciones del email
    // {
        // subject: ,
        // text: ,
        // to: ,
        // from:
    // }
    async enviarMailLink( orderid, email, clink , isCash ) {

        try {
            
            let emailT = await this.crearTransporter();
    
            const emailBody = this.prepararEmailBody( clink, isCash );
    
            const datos = {
                from: 'STORE NAME',
                to: email,
                subject: `Pedido #${ orderid } referencia para pagar ${isCash ? ' en OXXO PAY ' : ' por Transferencia '} - STORE NAME`,
                html: emailBody
            }
    
            await emailT.sendMail( datos );

            return true;
        } catch ( err ) {
            return false;
        }
    }

    async enviarMailAvisoError( orderid ){

        try {
            
            let emailT = await this.crearTransporter();
    
            const datos = {
                from: 'STORE NAME',
                to: process.env.EMAIL,
                cc: 'user@host.com',
                subject: `Pedido #${ orderid } error en Link de Pago`,
                text: `Pedido #${ orderid } no recibio su enlace de pago por Conekta.
                    Revisar metodo de pago y enviar el correcto. Gracias.`
            }
    
            await emailT.sendMail( datos );

            return true;
        } catch ( err ) {
            return false;
        }
    }

}

