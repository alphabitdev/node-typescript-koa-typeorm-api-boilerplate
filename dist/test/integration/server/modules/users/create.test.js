"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const supertest_1 = __importDefault(require("supertest"));
// import { CreateUser } from '../../../../src/db/entities/User';
const database_utils_1 = require("../../../database-utils");
const server_utils_1 = require("../../../server-utils");
mocha_1.describe('POST /api/v1/users', () => {
    const app = supertest_1.default(server_utils_1.testServer);
    mocha_1.beforeEach(async () => {
        await database_utils_1.truncateTables(['user']);
    });
    mocha_1.it('Should create a valid user and return 201', async () => {
        const user = {
            username: 'dummy@gmail.com',
            password: '123123123'
        };
        const res = await app
            .post('/api/v1/users')
            .send(user)
            .expect(201);
        chai_1.expect(res.header.location).equals('/api/v1/users/me');
        chai_1.expect(res.body).includes({
            message: 'created'
        });
    });
    mocha_1.it('Should return 400 when duplicate username', async () => {
        const user = {
            username: 'dummy@gmail.com',
            password: '123123123'
        };
        let res = await app
            .post('/api/v1/users')
            .send(user)
            .expect(201);
        res = await app
            .post('/api/v1/users')
            .send(user)
            .expect(400);
        chai_1.expect(res.body).eql({
            code: 30000,
            message: 'Username dummy@gmail.com already exists'
        });
    });
    mocha_1.it('Should return 400 when missing username', async () => {
        const user = {
            password: 'dummy1@gmail.com'
        };
        const res = await app
            .post('/api/v1/users')
            .send(user)
            .expect(400);
        chai_1.expect(res.body.code).equals(30001);
        chai_1.expect(res.body.fields.length).equals(1);
        chai_1.expect(res.body.fields[0].message).eql('"username" is required');
    });
    mocha_1.it('Should return 400 when missing password', async () => {
        const user = {
            username: 'dummy1@gmail.com'
        };
        const res = await app
            .post('/api/v1/users')
            .send(user)
            .expect(400);
        chai_1.expect(res.body.code).equals(30001);
        chai_1.expect(res.body.fields.length).equals(1);
        chai_1.expect(res.body.fields[0].message).eql('"password" is required');
    });
});
//# sourceMappingURL=create.test.js.map