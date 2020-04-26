"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_apikey_1 = __importDefault(require("uuid-apikey"));
const Authenticator_1 = require("../../../lib/Authenticator");
class UserController {
    constructor(manager) {
        this.manager = manager;
    }
    async create(ctx) {
        const newUserData = ctx.request.body;
        const result = await this.manager.create(newUserData);
        ctx.body = {
            message: 'created',
            data: result
        };
        ctx.status = 201;
        ctx.set('location', '/api/v1/users/me');
    }
    async login(ctx) {
        ctx.body = {
            accessToken: await this.manager.login(ctx.request.body.username, ctx.request.body.password)
        };
    }
    async createApiKey(ctx) {
        const user = await this.manager.findByUsername(ctx.state.user.username);
        const key = uuid_apikey_1.default.create();
        user.api_key = key.apiKey;
        const result = await this.manager.update(user);
        if (result.affected === 1) {
            ctx.body = { message: 'success', data: user.api_key };
            ctx.status = 200;
        }
        else {
            ctx.body = { message: 'error', code: 30001 };
            ctx.status = 400;
        }
    }
    async makeAdmin(ctx) {
        const user = await this.manager.findById(ctx.params.id);
        user.role = Authenticator_1.Role.admin;
        const result = await this.manager.update(user);
        if (result.affected === 1) {
            ctx.body = { message: 'success', data: user.role };
            ctx.status = 200;
        }
        else {
            ctx.body = { message: 'error', code: 30001 };
            ctx.status = 400;
        }
    }
    async makeUser(ctx) {
        const user = await this.manager.findById(ctx.params.id);
        user.role = Authenticator_1.Role.user;
        const result = await this.manager.update(user);
        if (result.affected === 1) {
            ctx.body = { message: 'success', data: user.role };
            ctx.status = 200;
        }
        else {
            ctx.body = { message: 'error', code: 30001 };
            ctx.status = 400;
        }
    }
    async changePassword(ctx) {
        const { newPassword } = ctx.request.body;
        const { oldPassword } = ctx.request.body;
        const result = await this.manager.changePassword(ctx.state.user.username, newPassword, oldPassword);
        if (result.affected === 1) {
            ctx.body = { message: 'success' };
            ctx.status = 204;
        }
        else {
            ctx.body = { message: 'error', code: 30001 };
            ctx.status = 400;
        }
    }
    async get(ctx) {
        const authUser = ctx.state.user;
        const user = await this.manager.findByUsername(authUser.username);
        ctx.body = { message: 'success', data: user };
        ctx.status = 200;
    }
    async list(ctx) {
        const users = await this.manager.findAll();
        ctx.body = { message: 'success', data: users };
        ctx.status = 200;
    }
    async delete(ctx) {
        const res = await this.manager.delete(ctx.params.id);
        if (res.affected === 1) {
            ctx.status = 204;
        }
        else {
            ctx.body = { message: 'error', code: 30001 };
            ctx.status = 400;
        }
    }
    async activate(ctx) {
        const res = await this.manager.activate(ctx.params.id);
        if (res.affected === 1) {
            ctx.status = 204;
        }
        else {
            ctx.body = { message: 'error', code: 30001 };
            ctx.status = 400;
        }
    }
    async deactivate(ctx) {
        if (Number(ctx.params.id) === Number(ctx.state.user.id)) {
            ctx.status = 400;
            return;
        }
        const res = await this.manager.deactivate(ctx.params.id);
        if (res.affected === 1) {
            ctx.status = 204;
        }
        else {
            ctx.body = { message: 'error', code: 30001 };
            ctx.status = 400;
        }
    }
}
exports.default = UserController;
//# sourceMappingURL=controller.js.map