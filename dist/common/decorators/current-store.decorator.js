"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentStore = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentStore = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.user?.currentStoreId ||
        request.headers['x-store-id'] ||
        request.storeId);
});
//# sourceMappingURL=current-store.decorator.js.map