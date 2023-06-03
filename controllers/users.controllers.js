import { response, request } from 'express';

import { ConektaApi } from '../handlers/conekta.js';
import { OrderData } from '../models/orderdata.js';
import { GHandler } from '../handlers/gmail-handler.js';

const coapi = new ConektaApi();
const ghandler = new GHandler();

const usuarioGet = ( req , res = response ) => {
    res.status(503).send('Not available');
}

const usuarioPost = async(req = request, res = response) => {
    // se puede validar un poco con las desestructuración
    const { orderid, name, email, phone, amount, isCash } = req.body;

    // Promo
    // let promo = amount.toFixed(2);

    const data = new OrderData( orderid, name, email, phone, parseFloat( amount ) );

    // Obtengo el link de Conekta con los datos que se capturaron
    const clink = await coapi.crearLink( data, isCash );

    // TODO: Modificar los casos para cuando el correo de GMAIL se desconecte.
    // conekta genera enlaces sin parar por que manda errores 500
    if(clink) {
        const msj = await ghandler.enviarMailLink( data.orderid, data.email, clink, isCash ) 
            ? 'OK'
            : 'EMAIL FAILL';
        
        if( msj === 'EMAIL FAILL')
            console.log('El mail del usuario no es correcto o el servidor esta fallando');

        res.status(200).send(msj);
    } else {
        if ( await ghandler.enviarMailAvisoError( data.orderid ) ) {
            res.status(204).send('LINK');
        } else {
            console.log('Servidor de mails esta fallando');
            res.status(204).send('EMAIL LINK FAILL');
        }
    }
}

const usuarioPut = (req, res = response) => {
    // TODO: PARA CANCELAR LINKS
    // const { id } = req.params.id;

    res.status(503).send('Not available');
}

const usuarioPatch = (req, res = response) => {
    res.status(503).send('Not available');
}

const usuarioDelete = (req, res = response) => {
    res.status(503).send('Not available');
}

export {
    usuarioGet,
    usuarioPost,
    usuarioPut,
    usuarioPatch,
    usuarioDelete
}