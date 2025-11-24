export class ExponentialBackoffStrategy {
    constructor(baseDelay = 500, maxDelay = 1000 * 60) {
        this.baseDelay = baseDelay;
        this.maxDelay = maxDelay;
    }
    getDelay(retryCount) {
        const delay = this.baseDelay * Math.pow(2, retryCount);
        return Math.min(delay, this.maxDelay);
    }
    shouldRetry(error, retryCount) {
        if (retryCount >= 5)
            return false;
        if (!error)
            return true;
        if (error instanceof Error) {
            const transientMessages = ["timeout", "network", "rate", "503"];
            return transientMessages.some((msg) => error.message.toLowerCase().includes(msg));
        }
        return true;
    }
}
