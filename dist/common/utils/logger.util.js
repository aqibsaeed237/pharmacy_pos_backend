"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogger = void 0;
const common_1 = require("@nestjs/common");
class AppLogger extends common_1.Logger {
    logContext(context, message, ...optionalParams) {
        super.log(`[${context}] ${message}`, ...optionalParams);
    }
    errorContext(context, message, trace, ...optionalParams) {
        super.error(`[${context}] ${message}`, trace, ...optionalParams);
    }
    warnContext(context, message, ...optionalParams) {
        super.warn(`[${context}] ${message}`, ...optionalParams);
    }
    debugContext(context, message, ...optionalParams) {
        super.debug(`[${context}] ${message}`, ...optionalParams);
    }
}
exports.AppLogger = AppLogger;
//# sourceMappingURL=logger.util.js.map