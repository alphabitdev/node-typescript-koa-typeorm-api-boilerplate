"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const supertest_1 = __importDefault(require("supertest"));
const typeorm_1 = require("typeorm");
const user_1 = __importDefault(require("../../../../../src/db/relational/repositories/user"));
const database_utils_1 = require("../../../database-utils");
const server_utils_1 = require("../../../server-utils");
mocha_1.describe('DELETE /api/v1/users/:id', () => {
    const app = supertest_1.default(server_utils_1.testServer);
    mocha_1.beforeEach(async () => {
        await database_utils_1.truncateTables(['user']);
    });
    mocha_1.it('Should delete a user', async () => {
        await server_utils_1.createUserTest({
            username: 'god1@gmail.com',
            password: 'godmode1'
        });
        await database_utils_1.setAdminMode('god1@gmail.com');
        const adminToken = await server_utils_1.getLoginToken('god1@gmail.com', 'godmode1');
        const user = await server_utils_1.createUserTest({
            username: 'user1@gmail.com',
            password: 'test1'
        });
        await app
            .delete(`/api/v1/users/${user.id}`)
            .set('Authorization', adminToken)
            .expect(204);
        const users = await typeorm_1.getCustomRepository(user_1.default).findAll();
        chai_1.expect(users.length).eql(1);
        chai_1.expect(users[0].username).eql('god1@gmail.com');
    });
    mocha_1.it('Should return 403 not allowed error when not admin', async () => {
        await server_utils_1.createUserTest({
            username: 'god@gmail.com',
            password: 'godmode'
        });
        const user = await server_utils_1.createUserTest({
            username: 'dude@gmail.com',
            password: 'test'
        });
        const token = await server_utils_1.getLoginToken('god@gmail.com', 'godmode');
        await app
            .delete(`/api/v1/users/${user.id}`)
            .set('Authorization', token)
            .expect(403);
    });
    mocha_1.it('Should return 401 when user is not activated', async () => {
        await server_utils_1.createUserTest({
            username: 'god@gmail.com',
            password: 'godmode'
        });
        await database_utils_1.setAdminMode('god@gmail.com');
        const adminToken = await server_utils_1.getLoginToken('god@gmail.com', 'godmode');
        const user = await server_utils_1.createUserTest({
            username: 'user@gmail.com',
            password: 'test'
        });
        await server_utils_1.deactivateUser('god@gmail.com');
        const res = await app
            .delete(`/api/v1/users/${user.id}`)
            .set('Authorization', adminToken)
            .expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
    mocha_1.it('Should return 401 when token is not valid', async () => {
        const user = await server_utils_1.createUserTest({
            username: 'user@gmail.com',
            password: 'test'
        });
        const res = await app
            .delete(`/api/v1/users/${user.id}`)
            .set('Authorization', 'wrong token')
            .expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
    mocha_1.it('Should return 401 when token is missing', async () => {
        const user = await server_utils_1.createUserTest({
            username: 'user@gmail.com',
            password: 'test'
        });
        const res = await app.delete(`/api/v1/users/${user.id}`).expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
});
//# sourceMappingURL=delete.test.js.map