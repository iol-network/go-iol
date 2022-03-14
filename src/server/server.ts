import express from 'express';
import cors from 'cors';

import transactionRoutes from './../app/routes/transactionRoutes'
import mineRoutes from './../app/routes/mineRoutes'
import AnalizeRoutes from './../app/routes/analizeRoutes'
import walletRoutes from './../app/routes/walletRoutes'
import DomainRoutes from './../app/routes/domainRoutes'
import NftRoutes from './../app/routes/nftRoutes'
import BlockRoutes from './../app/routes/blockRoutes'
import NodeRoutes from './../app/routes/nodeRoutes'

class Server {

    app: express.Application;

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    async middlewares() {
        let cors_options = {
            origin: '*',
            optionsSuccessStatus: 200
        }

        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(cors(cors_options));

    }

    routes() {
        this.app.use('/', AnalizeRoutes);
        this.app.use('/', transactionRoutes);
        this.app.use('/', mineRoutes);
        this.app.use('/', walletRoutes);
        this.app.use('/', DomainRoutes);
        this.app.use('/', NftRoutes);
        this.app.use('/', BlockRoutes);
        this.app.use('/', NodeRoutes);
    }

}

export default new Server().app;