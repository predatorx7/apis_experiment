import cors from 'cors';
import express = require('express');
import { AddressInfo } from 'net';
import * as http from 'http';
import bodyParser = require('body-parser');
import { ServerDefaultConfig } from './config/defaults';
import { OperationStartupShutdown } from './config/operation';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { RunnerInterface } from './config/runner';
import { getRoutes as registerRoutes } from './routes';
import packageJson from '../package.json';
import { getRevision } from './config/revision';

export class ApiServer implements RunnerInterface {
    public PORT: number = +(process.env.PORT || ServerDefaultConfig.PORT);
    public server!: http.Server;
    log = pino().child({ module: 'ApiServer' })

    constructor(private readonly operations: OperationStartupShutdown, private readonly app: express.Application = express()) {
        this.server = http.createServer(app);
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json({ limit: "500kb" }));
        this.app.use(cors());
        this.app.use(helmet());
        app.use(pinoHttp());
    }

    async start() {
        this.setupRoutes();
        this.setupHealth();
        this.startServer();
        this.log.info("Server setup completed");
    }

    async stop() {
        this.closeServer();
    }

    setupRoutes() {
        const router = express.Router();
        registerRoutes(router);
        this.app.use(router);
    }

    setupHealth() {
        this.log.info("Setting up health");
        const router = express.Router();
        router.get('/auth/health', (req, res) => {
            res.status(200).send({
                status: true,
                version: packageJson.version,
                revision: getRevision(),
                startup_time: this.operations.startupDateTime,
                elapsed_duration: this.operations.elapsedDurationMs,
                message: `Server running at ${this.serverUrl()}`,
            });
        });
        router.get('/auth/ping', (req, res) => {
            res.status(200).send('pong');
        });
        this.app.use(router);
    }

    startServer() {
        this.server?.listen(this.PORT, () => {
            this.log.info(`Server running at ${this.serverUrl()}`);
        });
    }

    async closeServer() {
        this.log.info('Closing server')
        return new Promise<void>(resolve => {
            if (this.server) {
                this.server.close(() => {
                    return resolve();
                });
            } else {
                return resolve();
            }
        });
    }

    public serverUrl(): string {
        const addressInfo = this.server.address() as AddressInfo;
        const address = addressInfo.address === '::' ? 'localhost' : addressInfo.address;
        const url = `http://${address}:${addressInfo.port}`;
        return url;
    }
}
