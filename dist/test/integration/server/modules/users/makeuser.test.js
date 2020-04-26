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
const Authenticator_1 = require("../../../../../src/lib/Authenticator");
mocha_1.describe('GET /api/v1/users/makeuser:id', () => {
    const app = supertest_1.default(server_utils_1.testServer);
    let user;
    let admin;
    let token;
    let adminToken;
    mocha_1.beforeEach(async () => {
        await database_utils_1.truncateTables(['user']);
        user = await server_utils_1.createUserTest({
            username: 'user1@gmail.com',
            password: 'test1'
        });
        admin = await server_utils_1.createAdminTest({
            username: 'god1@gmail.com',
            password: 'godmode1'
        });
        await database_utils_1.setAdminMode(admin.username);
        token = await server_utils_1.getLoginToken(user.username, 'test1');
        adminToken = await server_utils_1.getLoginToken(admin.username, 'godmode1');
    });
    mocha_1.it('Should make a admin user', async () => {
        await app
            .get(`/api/v1/users/makeuser/${admin.id}`)
            .set('Authorization', adminToken)
            .expect(200);
        const updatedUser = await typeorm_1.getCustomRepository(user_1.default).findByUsername(user.username);
        chai_1.expect(updatedUser.role).eql(Authenticator_1.Role.user);
    });
    mocha_1.it('Should return 403 not allowed error when not admin', async () => {
        await app
            .get(`/api/v1/users/makeuser/${admin.id}`)
            .set('Authorization', token)
            .expect(403);
    });
    mocha_1.it('Should return 401 when user is not activated', async () => {
        await server_utils_1.deactivateUser(admin.username);
        const res = await app
            .get(`/api/v1/users/makeuser/${user.id}`)
            .set('Authorization', adminToken)
            .expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
    mocha_1.it('Should return 401 when token is not valid', async () => {
        const res = await app
            .get(`/api/v1/users/makeuser/${user.id}`)
            .set('Authorization', 'wrong token')
            .expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
    mocha_1.it('Should return 401 when token is missing', async () => {
        const res = await app.get(`/api/v1/users/makeuser/${user.id}`).expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
});
//# sourceMappingURL=makeuser.test.js.map