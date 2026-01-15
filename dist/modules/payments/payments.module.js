"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const stripe_service_1 = require("./services/stripe.service");
const payfast_service_1 = require("./services/payfast.service");
const payment_controller_1 = require("./controllers/payment.controller");
const sale_entity_1 = require("../../database/entities/sale.entity");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, typeorm_1.TypeOrmModule.forFeature([sale_entity_1.Sale])],
        providers: [stripe_service_1.StripeService, payfast_service_1.PayFastService],
        controllers: [payment_controller_1.PaymentController],
        exports: [stripe_service_1.StripeService, payfast_service_1.PayFastService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map