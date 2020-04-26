"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const Hasher_1 = require("../../../src/lib/Hasher");
mocha_1.describe('BCryptHasher', () => {
    mocha_1.it('Should return validate password', async () => {
        const hasher = new Hasher_1.BCryptHasher();
        const hashedPassword = await hasher.hashPassword('password');
        const verify = await hasher.verifyPassword('password', hashedPassword);
        chai_1.expect(verify).equals(true);
    });
    mocha_1.it('Should return false when password is not valid', async () => {
        const hasher = new Hasher_1.BCryptHasher();
        const hashedPassword = await hasher.hashPassword('password');
        const verify = await hasher.verifyPassword('password123', hashedPassword);
        chai_1.expect(verify).equals(false);
    });
});
//# sourceMappingURL=hasher.test.js.map