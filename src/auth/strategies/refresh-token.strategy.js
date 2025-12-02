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
exports.RefreshTokenStrategy = void 0;
// src/auth/strategies/refresh-token.strategy.ts
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var passport_jwt_1 = require("passport-jwt");
var RefreshTokenStrategy = /** @class */ (function (_super) {
    __extends(RefreshTokenStrategy, _super);
    function RefreshTokenStrategy() {
        return _super.call(this, {
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
            passReqToCallback: true
        }) || this;
    }
    RefreshTokenStrategy.prototype.validate = function (req, payload) {
        var _a;
        var refreshToken = (_a = req.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer', '').trim();
        return { userId: payload.sub, email: payload.email, refreshToken: refreshToken };
    };
    RefreshTokenStrategy = __decorate([
        (0, common_1.Injectable)()
    ], RefreshTokenStrategy);
    return RefreshTokenStrategy;
}((0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh')));
exports.RefreshTokenStrategy = RefreshTokenStrategy;
