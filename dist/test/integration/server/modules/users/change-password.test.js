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
mocha_1.describe('PUT /api/v1/users/password', () => {
    let token;
    const app = supertest_1.default(server_utils_1.testServer);
    mocha_1.beforeEach(async () => {
        await database_utils_1.truncateTables(['user']);
        const user = {
            username: 'dude@gmail.com',
            password: 'secret'
        };
        await server_utils_1.createUserTest(user);
        token = await server_utils_1.getLoginToken('dude@gmail.com', 'secret');
    });
    mocha_1.it('Should update user password and login successfully', async () => {
        let res = await app
            .put('/api/v1/users/password')
            .set('Authorization', token)
            .send({ newPassword: 'newPassord', oldPassword: 'secret' })
            .expect(204);
        res = await app
            .post('/api/v1/users/login')
            .send({ username: 'dude@gmail.com', password: 'newPassord' })
            .expect(200);
        chai_1.expect(res.body).keys(['accessToken']);
    });
    mocha_1.it('Should update user password but fail on login', async () => {
        let res = await app
            .put('/api/v1/users/password')
            .set('Authorization', token)
            .send({ newPassword: 'newPassord', oldPassword: 'secret' })
            .expect(204);
        res = await app
            .post('/api/v1/users/login')
            .send({ username: 'dude@gmail.com', password: 'secret' })
            .expect(400);
        chai_1.expect(res.body.code).equals(30000);
    });
    mocha_1.it('Should return 400 when missing body data', async () => {
        const res = await app
            .put('/api/v1/users/password')
            .set('Authorization', token)
            .send({ newPassword: 'newPassord' })
            .expect(400);
        chai_1.expect(res.body.code).equals(30001);
        chai_1.expect(res.body.fields.length).equals(1);
        chai_1.expect(res.body.fields[0].message).eql('"oldPassword" is required');
    });
    mocha_1.it('Should return 401 when user is not activated', async () => {
        await server_utils_1.deactivateUser('dude@gmail.com');
        const res = await app
            .put('/api/v1/users/password')
            .set('Authorization', token)
            .expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
    mocha_1.it('Should return 401 when token is not valid', async () => {
        const res = await app
            .put('/api/v1/users/password')
            .set('Authorization', 'wrong token')
            .expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
    mocha_1.it('Should return 401 when token is missing', async () => {
        const res = await app.put('/api/v1/users/password').expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
});
//# sourceMappingURL=change-password.test.js.map