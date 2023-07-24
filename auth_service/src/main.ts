import 'dotenv/config'
import { OperationStartupShutdown } from './config/operation';
import { RunnerInterface } from './config/runner';
import { ApiServer } from './server';

const main = async (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const operation = new OperationStartupShutdown();

        const runners: RunnerInterface[] = [
            operation,
            new ApiServer(operation),
        ];

        Promise.all(runners.map((it) => it.start()))
            .then(() => resolve())
            .catch(reject);

        const graceful = () => {
            Promise.all(runners.map((it) => it.stop()))
                .then(() => process.exit(0));
        };

        // Stop graceful
        process.on('SIGTERM', graceful);
        process.on('SIGINT', graceful);
    });
};

main();
