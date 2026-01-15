import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  logContext(context: string, message: string, ...optionalParams: any[]) {
    super.log(`[${context}] ${message}`, ...optionalParams);
  }

  errorContext(
    context: string,
    message: string,
    trace?: string,
    ...optionalParams: any[]
  ) {
    super.error(`[${context}] ${message}`, trace, ...optionalParams);
  }

  warnContext(context: string, message: string, ...optionalParams: any[]) {
    super.warn(`[${context}] ${message}`, ...optionalParams);
  }

  debugContext(context: string, message: string, ...optionalParams: any[]) {
    super.debug(`[${context}] ${message}`, ...optionalParams);
  }
}
