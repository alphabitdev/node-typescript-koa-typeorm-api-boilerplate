"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_1 = __importDefault(require("../../src/db/relational/repositories/user"));
const Authenticator_1 = require("../../src/lib/Authenticator");
const config_1 = __importDefault(require("../../src/db/config"));
const rdbOptions = config_1.default.relational.test;
async function connectDatabase() {
    await typeorm_1.createConnection(rdbOptions);
    await typeorm_1.getConnection().query("SET TIME ZONE 'UTC'");
}
exports.connectDatabase = connectDatabase;
async function closeDatabase() {
    await typeorm_1.getConnection().close();
}
exports.closeDatabase = closeDatabase;
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
async function truncateTables(tables) {
    // eslint-disable-next-line no-restricted-syntax
    for (const table of tables) {
        // eslint-disable-next-line no-await-in-loop
        await typeorm_1.getRepository(capitalize(table)).clear();
    }
}
exports.truncateTables = truncateTables;
async function setAdminMode(username) {
    return typeorm_1.getCustomRepository(user_1.default).update({ username }, { role: Authenticator_1.Role.admin });
}
exports.setAdminMode = setAdminMode;
async function removeAdminMode(username) {
    return typeorm_1.getCustomRepository(user_1.default).update({ username }, { role: Authenticator_1.Role.user });
}
exports.removeAdminMode = removeAdminMode;
//# sourceMappingURL=database-utils.js.map