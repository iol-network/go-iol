import SocketClass from './socket'
import Background from './background';
import express from 'express';
import * as cluster from 'cluster';
import * as os from 'os';
import { Server } from "socket.io";

import { PRODUCTION, HTTPS_INTERFACE } from './../configs/server_config';
import { DIR_FILES, DIR_BLOCKS, DIR_LOGS } from './../configs/iol_config'

import { isFileExist, createDir } from './../app/utils/fileUtils'

class Cluster {

    app: any;
    port: number;
    count_cores: number;

    constructor(app: express.Application, port: number) {
        this.app = app;
        this.port = port;
        this.count_cores = os.cpus().length;
        this.upServer();
    }

    upServer(): void {

        // Check dir and Create folders
        this.createDir();

        var redis = require('socket.io-redis');
        var io = new Server();
        io.adapter(redis({ host: 'localhost', port: 6379 }));

        this.app.io = io;

        if (PRODUCTION === false) {

            let server = this.app.listen(this.port, (): void => {
                console.log(`DEVELOPMENT |||| Server on | Port: ${this.port} | Proccess: ${process.pid}`)
                this.app.io.attach(server);
            });

        } else {

            if (cluster.isMaster) {

                console.log(`Master (proccess ${process.pid}) is running | This machine there are ${this.count_cores} cores`);
                for (let i = 0; i < this.count_cores; i++) {
                    cluster.fork();
                }

            } else {

                let server = this.app.listen(this.port, (): void => {
                    console.log(`Server on | Port: ${this.port} | Proccess: ${process.pid}`)
                    this.app.io.attach(server);
                });

            }

        }

        // @ts-ignore
        if (HTTPS_INTERFACE === true) {

            const https = require('https');
            const fs = require('fs');

            var options = {
                key: fs.readFileSync('/etc/letsencrypt/live/iolnetwork.org/privkey.pem'),
                cert: fs.readFileSync('/etc/letsencrypt/live/iolnetwork.org/cert.pem'),
            };

            https.createServer(options, this.app).listen(443);

        }

        new SocketClass(io)
        new Background();

    }

    async createDir(): Promise<void> {

        if (!await isFileExist(DIR_FILES)) {
            await createDir(DIR_FILES);
        }

        if (!await isFileExist(DIR_BLOCKS)) {
            await createDir(DIR_BLOCKS);
        }

        if (!await isFileExist(DIR_LOGS)) {
            await createDir(DIR_LOGS);
        }

    }

}

export default Cluster;