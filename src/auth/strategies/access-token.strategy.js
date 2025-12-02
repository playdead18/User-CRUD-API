"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AccessTokenStrategy = void 0;
// src/auth/strategies/access-token.strategy.ts
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var passport_jwt_1 = require("passport-jwt");
var AccessTokenStrategy = /** @class */ (function (_super) {
    __extends(AccessTokenStrategy, _super);
    function AccessTokenStrategy() {
        return _super.call(this, {
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET || 'access-secret-key'
        }) || this;
    }
    AccessTokenStrategy.prototype.validate = function (payload) {
        return { userId: payload.sub, email: payload.email };
    };
    AccessTokenStrategy = __decorate([
        (0, common_1.Injectable)()
    ], AccessTokenStrategy);
    return AccessTokenStrategy;
}((0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt')));
exports.AccessTokenStrategy = AccessTokenStrategy;
