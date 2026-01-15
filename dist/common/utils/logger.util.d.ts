import { Logger } from '@nestjs/common';
export declare class AppLogger extends Logger {
    logContext(context: string, message: string, ...optionalParams: any[]): void;
    errorContext(context: string, message: string, trace?: string, ...optionalParams: any[]): void;
    warnContext(context: string, message: string, ...optionalParams: any[]): void;
    debugContext(context: string, message: string, ...optionalParams: any[]): void;
}
