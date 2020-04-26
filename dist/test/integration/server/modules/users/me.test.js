"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const supertest_1 = __importDefault(require("supertest"));
const database_utils_1 = require("../../../database-utils");
const server_utils_1 = require("../../../server-utils");
mocha_1.describe('GET /api/v1/users/me', () => {
    const app = supertest_1.default(server_utils_1.testServer);
    mocha_1.beforeEach(async () => {
        await database_utils_1.truncateTables(['user']);
        const user = {
            username: 'dude@gmail.com',
            password: 'test'
        };
        await server_utils_1.createUserTest(user);
    });
    mocha_1.it('Should return user information', async () => {
        const token = await server_utils_1.getLoginToken('dude@gmail.com', 'test');
        const res = await app
            .get('/api/v1/users/me')
            .set('Authorization', token)
            .expect(200);
        chai_1.expect(res.body.data).keys([
            'id',
            'username',
            'created',
            'updated',
            'activated',
            'api_key',
            'name',
            'password',
            'role'
        ]);
    });
    mocha_1.it('Should return 401 when user is not activated', async () => {
        const token = await server_utils_1.getLoginToken('dude@gmail.com', 'test');
        await server_utils_1.deactivateUser('dude@gmail.com');
        const res = await app
            .get('/api/v1/users/me')
            .set('Authorization', token)
            .expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
    mocha_1.it('Should return 401 when token is not valid', async () => {
        const res = await app
            .get('/api/v1/users/me')
            .set('Authorization', 'wrong token')
            .expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
    mocha_1.it('Should return 401 when token is missing', async () => {
        const res = await app.get('/api/v1/users/me').expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
});
//# sourceMappingURL=me.test.js.map