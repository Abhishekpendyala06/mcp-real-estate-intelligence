import * as winston from 'winston';
import { getEnv } from '../config/env.js';

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    const env = getEnv();
    this.logger = winston.createLogger({
      level: env.LOG_LEVEL,
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      ],
    });
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string): void {
    this.logger.info(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }
}
