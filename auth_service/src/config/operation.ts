import pino from "pino";
import { RunnerInterface } from "./runner";

export class OperationStartupShutdown implements RunnerInterface {
    log = pino().child({module: 'app:operation-info'});

    private startup!: Date;

    get startupDateTime() {
        return this.startup;
    }

    get elapsedDurationMs() {
        return new Date().getTime() - this.startup.getTime();
    }

    private stopped!: Date;

    async start() {
        this.startup = new Date();
        this.log.info(`Server started at ${this.startup.toLocaleString()}`);
        (BigInt.prototype as any).toJSON = function () {
            return Number(this)
        };
    }

    async stop() {
        this.stopped = new Date();
        this.log.info(`Server stopped at ${this.stopped.toLocaleString()}`);
        const elapsedMs = this.stopped.getTime() - this.startup.getTime();
        this.log.info(`Server operated for duration: ${elapsedMs} milliseconds`);
    }
}