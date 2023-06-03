
// TODO: Implementar las validaciones en los middlewares
export class OrderData {

    orderid = '';
    nombre = '';
    email = '';
    telefono = '';
    monto = 0;

    constructor(orderid, nombre, email='', telefono = '', monto){
        // replace(/\D/g,'') - elimina todo lo que no es digito
        // match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) - valida si un correo es valido
        // replace(/[^\p{L} ]/gu,'') - elimina todos los simbolos que pueda tener un nombre

        this.orderid = orderid.replace(/\D/g,''); // para eliminar el #
        this.nombre = nombre.replace(/[^\p{L} ]/gu,'');


        if(email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
            this.email = email;
        }

        telefono = telefono.replace(/\D/g,'');
        if(telefono.length > 9) {
            this.telefono = telefono.substring(telefono.length-10,telefono.length);
        } else {
            this.telefono = '0000000000'
        }

        this.monto =  parseFloat(monto).toFixed(2);
    }
}