export interface RunnerInterface {
    start(): Promise<void>;
    stop(): Promise<void>;
}