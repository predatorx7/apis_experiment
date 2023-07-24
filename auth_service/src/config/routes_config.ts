import express = require('express');
import pino from 'pino';

export abstract class RoutesConfig {
    router: express.Router;
    name: string;
    currentPath?: string;
    private log = pino().child({module: 'RoutesConfig'});

    constructor(router: express.Router, name: string, currentPath?: string) {
        this.router = router;
        this.name = name;
        this.currentPath = currentPath;
        this.configureRoutes();
        const log = pino().child({module: 'RoutesConfig'});
        log.info(`Routes configured for ${name}`);
    }

    abstract build(router: express.Router): void;

    configureRoutes() {
        const router = express.Router();
        this.build(router);
        const path = this.currentPath;
        if (path) {
            this.router.use(path, router);
        } else {
            this.router.use(router);
        }
    }
}
