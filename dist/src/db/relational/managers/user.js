"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable class-methods-use-this */
const typeorm_1 = require("typeorm");
const errors_1 = require("../../../errors");
const user_1 = __importDefault(require("../repositories/user"));
const ActivationError_1 = __importDefault(require("../../../errors/ActivationError"));
class UserManager {
    constructor(hasher, auth) {
        this.hasher = hasher;
        this.auth = auth;
    }
    getAuthenticator() {
        return this.auth;
    }
    async findByUsername(username) {
        return typeorm_1.getCustomRepository(user_1.default).findByUsername(username);
    }
    async findById(id) {
        return typeorm_1.getCustomRepository(user_1.default).findById(id);
    }
    async findAll() {
        return typeorm_1.getCustomRepository(user_1.default).findAll();
    }
    async create(user) {
        const hashPassword = await this.hasher.hashPassword(user.password);
        // eslint-disable-next-line no-param-reassign
        user.password = hashPassword;
        return typeorm_1.getCustomRepository(user_1.default).createNew(user);
    }
    async update(user) {
        return typeorm_1.getCustomRepository(user_1.default).update({ id: user.id }, { role: user.role, api_key: user.api_key, activated: user.activated, name: user.name });
    }
    async login(username, password) {
        let user;
        try {
            user = await typeorm_1.getCustomRepository(user_1.default).findByUsername(username);
        }
        catch (e) {
            throw new errors_1.ValidationError('Wrong credentials');
        }
        if (!user.activated) {
            throw new ActivationError_1.default();
        }
        if (await this.hasher.verifyPassword(password, user.password)) {
            return this.auth.authenticate(user);
        }
        throw new errors_1.ValidationError('Wrong credentials');
    }
    async changePassword(username, newPassword, oldPassword) {
        const user = await typeorm_1.getCustomRepository(user_1.default).findByUsername(username);
        const validPassword = await this.hasher.verifyPassword(oldPassword, user.password);
        if (!validPassword) {
            throw new errors_1.ValidationError('Old password is not correct');
        }
        const hashPassword = await this.hasher.hashPassword(newPassword);
        return typeorm_1.getCustomRepository(user_1.default).changePassword(username, hashPassword);
    }
    delete(userId) {
        return typeorm_1.getCustomRepository(user_1.default).delete(userId);
    }
    activate(userId) {
        return typeorm_1.getCustomRepository(user_1.default).activate(userId);
    }
    deactivate(userId) {
        return typeorm_1.getCustomRepository(user_1.default).deactivate(userId);
    }
}
exports.default = UserManager;
//# sourceMappingURL=user.js.map