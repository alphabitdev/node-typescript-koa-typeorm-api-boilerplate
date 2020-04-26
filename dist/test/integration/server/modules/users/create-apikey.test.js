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
mocha_1.describe('GET /api/v1/users/createapikey', () => {
    const app = supertest_1.default(server_utils_1.testServer);
    let token;
    mocha_1.beforeEach(async () => {
        await database_utils_1.truncateTables(['user']);
        const user = {
            username: 'dude@gmail.com',
            password: 'test'
        };
        await server_utils_1.createUserTest(user);
        token = await server_utils_1.getLoginToken('dude@gmail.com', 'test');
    });
    mocha_1.it('Should create a api-key and return it in data with 200', async () => {
        const res = await app
            .get('/api/v1/users/createapikey')
            .set({ Authorization: token })
            .expect(200);
        chai_1.expect(res.body).include({
            message: 'success'
        });
        chai_1.expect(res.body).to.have.property('data');
    });
    mocha_1.it('Should return 401 when user is not activated', async () => {
        await server_utils_1.deactivateUser('dude@gmail.com');
        const res = await app
            .get('/api/v1/users/createapikey')
            .set('Authorization', token)
            .expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
    mocha_1.it('Should return 401 when token is not valid', async () => {
        const res = await app
            .get('/api/v1/users/createapikey')
            .set('Authorization', 'wrong token')
            .expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
    mocha_1.it('Should return 401 when token is missing', async () => {
        const res = await app.get('/api/v1/users/createapikey').expect(401);
        chai_1.expect(res.body.code).equals(30002);
    });
});
//# sourceMappingURL=create-apikey.test.js.map