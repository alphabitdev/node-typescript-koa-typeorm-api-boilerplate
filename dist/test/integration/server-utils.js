"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const typeorm_1 = require("typeorm");
const supertest_1 = __importDefault(require("supertest"));
const user_1 = __importDefault(require("../../src/db/relational/repositories/user"));
const Authenticator_1 = require("../../src/lib/Authenticator");
const KoaServer_1 = __importDefault(require("../../src/server/KoaServer"));
const logger = pino_1.default({ name: 'test', level: 'silent' });
const port = Number(process.env.PORT) || 8080;
const koaServer = new KoaServer_1.default(logger);
koaServer.init();
exports.testServer = koaServer.listen(port);
function shuttingDown() {
    koaServer.getHealthMonitor().shuttingDown();
}
exports.shuttingDown = shuttingDown;
function end() {
    return koaServer.closeServer();
}
exports.end = end;
async function createUserTest(newUser) {
    await supertest_1.default(exports.testServer).post('/api/v1/users').send(newUser).expect(201);
    const repo = typeorm_1.getCustomRepository(user_1.default);
    const user = await repo.findByUsername(newUser.username);
    await repo.activate(user.id);
    return user;
}
exports.createUserTest = createUserTest;
async function createAdminTest(newUser) {
    const user = await createUserTest(newUser);
    await typeorm_1.getCustomRepository(user_1.default).update({ id: user.id }, { role: Authenticator_1.Role.admin });
    return user;
}
exports.createAdminTest = createAdminTest;
async function getLoginToken(username, password) {
    const res = await supertest_1.default(exports.testServer)
        .post('/api/v1/users/login')
        .send({ username, password })
        .expect(200);
    return res.body.accessToken;
}
exports.getLoginToken = getLoginToken;
async function deactivateUser(username) {
    const user = await typeorm_1.getCustomRepository(user_1.default).findByUsername(username);
    return typeorm_1.getCustomRepository(user_1.default).deactivate(user.id);
}
exports.deactivateUser = deactivateUser;
async function activateUser(username) {
    const user = await typeorm_1.getCustomRepository(user_1.default).findByUsername(username);
    return typeorm_1.getCustomRepository(user_1.default).activate(user.id);
}
exports.activateUser = activateUser;
//# sourceMappingURL=server-utils.js.map