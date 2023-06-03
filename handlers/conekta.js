
import axios from 'axios';



export class ConektaApi {
    

    constructor(){

    }

    async crearLink({orderid = '00000', nombre = 'Noname', email = 'Noemail', 
                        telefono = '0000000000', monto = 0}, isCash = true){
        try {
            
            // k - es la llave de autorización en base64
            const k = 'Basic ' + process.env.COAPI;
            // Se calcula la fecha de inicio y limite en formato UNIX
            const dHoy = new Date();
            const dLim = new Date();
            dLim.setDate(dHoy.getDate()+2);

            // El monto se va sin decimales por eso se multiplica por 100
            // Se hace un post payment link para generar el enlace en Conekta
            const resp = await axios.post('https://api.conekta.io/checkouts',{
                "name": orderid,
                "type": "PaymentLink",
                "recurrent": false,
                "expires_at": Math.floor(dLim.getTime() / 1000),
                "allowed_payment_methods": [ isCash ? "cash" : "bank_transfer" ],
                "needs_shipping_contact": false,
                "monthly_installments_enabled": false,
                "monthly_installments_options": [3],
                "order_template": {
                    "line_items": [{
                        "name": orderid,
                        "unit_price": monto * 100,
                        "quantity": 1
                    }],
                    "currency": "MXN",
                    "customer_info": {
                        "name": nombre,
                        "email": email,
                        "phone": telefono
                    }
                }
            }, {
                headers: {
                    'Accept':'application/vnd.conekta-v2.0.0+json',
                    'Accept-Language':'es',
                    'Content-Type':'application/json',
                    'Authorization': k
                }
            });
            
            // Si la respuesta no dice checkout no se genero el enlace
            if(!resp.data.object === 'checkout') return null;

            // Se envia la url del enlace creado para enviar el correo.
            return resp.data.url;

        } catch (err) {
            return null;
        }
    }
}