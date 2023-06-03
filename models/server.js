import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { router } from '../routes/user.routes.js';

export class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/conekta';

        // Middlewares (subfunciones para el web server)
        this.middlewares();

        // Rutas de la app
        this.routes();
    }

    middlewares() {

        // HELMET
        this.app.use( helmet() );
        this.app.disable('x-powered-by');

        //  CORS
        this.app.use( cors() );

        // Parsing y Lectura Body
        this.app.use( express.json() );

        // DIrectorio Public
        this.app.use( express.static('public') );

    }

    routes() {
        this.app.use( this.usuariosPath, router );
    }


    listen() {
        this.app.listen( this.port, () => {
            console.log( 'Servidor corriendo en puerto', this.port );
        });
    }
}