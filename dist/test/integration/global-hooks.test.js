"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const database_utils_1 = require("./database-utils");
const server_utils_1 = require("./server-utils");
mocha_1.before(async () => {
    console.log('Initializing database');
    await database_utils_1.connectDatabase();
});
mocha_1.after(async () => {
    await database_utils_1.closeDatabase();
    server_utils_1.end();
});
//# sourceMappingURL=global-hooks.test.js.map