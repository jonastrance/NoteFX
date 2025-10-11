import type { RetryStrategy } from "../types/sync";

export class ExponentialBackoffStrategy implements RetryStrategy {
  constructor(private readonly baseDelay = 500, private readonly maxDelay = 1000 * 60) {}

  getDelay(retryCount: number): number {
    const delay = this.baseDelay * Math.pow(2, retryCount);
    return Math.min(delay, this.maxDelay);
  }

  shouldRetry(error: unknown, retryCount: number): boolean {
    if (retryCount >= 5) return false;
    if (!error) return true;
    if (error instanceof Error) {
      const transientMessages = ["timeout", "network", "rate", "503"];
      return transientMessages.some((msg) => error.message.toLowerCase().includes(msg));
    }
    return true;
  }
}
