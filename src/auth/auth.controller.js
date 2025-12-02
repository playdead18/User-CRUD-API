"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.AuthController = void 0;
// src/auth/auth.controller.ts
var common_1 = require("@nestjs/common");
var access_token_guard_1 = require("./guards/access-token.guard");
var refresh_token_guard_1 = require("./guards/refresh-token.guard");
var current_user_decorator_1 = require("./decorators/current-user.decorator");
var AuthController = /** @class */ (function () {
    function AuthController(authService) {
        this.authService = authService;
    }
    AuthController.prototype.register = function (registerDto) {
        return this.authService.register(registerDto);
    };
    AuthController.prototype.login = function (loginDto) {
        return this.authService.login(loginDto);
    };
    AuthController.prototype.logout = function (userId) {
        return this.authService.logout(userId);
    };
    AuthController.prototype.refreshTokens = function (userId, refreshToken) {
        return this.authService.refreshTokens(userId, refreshToken);
    };
    AuthController.prototype.getProfile = function (user) {
        return user;
    };
    __decorate([
        (0, common_1.Post)('register'),
        (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
        __param(0, (0, common_1.Body)())
    ], AuthController.prototype, "register");
    __decorate([
        (0, common_1.Post)('login'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        __param(0, (0, common_1.Body)())
    ], AuthController.prototype, "login");
    __decorate([
        (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
        (0, common_1.Post)('logout'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        __param(0, (0, current_user_decorator_1.CurrentUser)('userId'))
    ], AuthController.prototype, "logout");
    __decorate([
        (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
        (0, common_1.Post)('refresh'),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
        __param(1, (0, current_user_decorator_1.CurrentUser)('refreshToken'))
    ], AuthController.prototype, "refreshTokens");
    __decorate([
        (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
        (0, common_1.Get)('me'),
        __param(0, (0, current_user_decorator_1.CurrentUser)())
    ], AuthController.prototype, "getProfile");
    AuthController = __decorate([
        (0, common_1.Controller)('auth')
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
