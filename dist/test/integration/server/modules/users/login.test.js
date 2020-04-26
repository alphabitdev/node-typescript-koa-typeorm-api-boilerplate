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
mocha_1.describe('POST /api/v1/users/login', () => {
    const app = supertest_1.default(server_utils_1.testServer);
    mocha_1.beforeEach(async () => {
        await database_utils_1.truncateTables(['user']);
        const user = {
            username: 'dude@gmail.com',
            password: 'test'
        };
        await server_utils_1.createUserTest(user);
    });
    mocha_1.it('Should return a valid token', async () => {
        const res = await app
            .post('/api/v1/users/login')
            .send({ username: 'dude@gmail.com', password: 'test' })
            .expect(200);
        chai_1.expect(res.body).keys(['accessToken']);
    });
    mocha_1.it('Should return 400 when non existant username', async () => {
        const res = await app
            .post('/api/v1/users/login')
            .send({ username: 'nope', password: 'test' })
            .expect(400);
        chai_1.expect(res.body.code).equals(30000);
        chai_1.expect(res.body.message).eql('Wrong credentials');
    });
    mocha_1.it('Should return 400 when wrong password', async () => {
        const res = await app
            .post('/api/v1/users/login')
            .send({ username: 'dude@gmail.com', password: 'wrong' })
            .expect(400);
        chai_1.expect(res.body.code).equals(30000);
        chai_1.expect(res.body.message).eql('Wrong credentials');
    });
    mocha_1.it('Should return 400 when missing password', async () => {
        const res = await app
            .post('/api/v1/users/login')
            .send({ username: 'dude@mail.com' })
            .expect(400);
        chai_1.expect(res.body.code).equals(30001);
        chai_1.expect(res.body.fields.length).equals(1);
        chai_1.expect(res.body.fields[0].message).eql('"password" is required');
    });
    mocha_1.it('Should return 400 when user is not activated', async () => {
        await server_utils_1.deactivateUser('dude@gmail.com');
        const res = await app
            .post('/api/v1/users/login')
            .send({ username: 'dude@gmail.com', password: 'test' })
            .expect(401);
        chai_1.expect(res.body.code).equals(30004);
        chai_1.expect(res.body.message).eql('User not activated');
    });
});
//# sourceMappingURL=login.test.js.map