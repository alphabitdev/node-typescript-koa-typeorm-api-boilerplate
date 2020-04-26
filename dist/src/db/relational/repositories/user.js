"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const errors_1 = require("../../../errors");
const User_1 = require("../entities/User");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    async findByUsername(username) {
        return this.findOneOrFail({ username });
    }
    async findById(id) {
        return this.findOneOrFail({ id });
    }
    async updateApiKey(user) {
        return super.update({ id: user.id }, { api_key: user.api_key });
    }
    async activate(id) {
        return super.update({ id }, { activated: true });
    }
    async deactivate(id) {
        return super.update({ id }, { activated: false });
    }
    async updateRole(user) {
        return super.update({ id: user.id }, { role: user.role });
    }
    async findAll() {
        return super.find();
    }
    async createNew(user) {
        try {
            return await this.insert(user);
        }
        catch (err) {
            if (err.code === '23505') {
                throw new errors_1.ValidationError(`Username ${user.username} already exists`, err);
            }
            throw err;
        }
    }
    async changePassword(username, newPass) {
        return super.update({ username }, { password: newPass });
    }
    delete(userId) {
        return super.delete({ id: userId });
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(User_1.User)
], UserRepository);
exports.default = UserRepository;
//# sourceMappingURL=user.js.map