"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = __importStar(require("sinon"));
const mocha_1 = require("mocha");
const errors_1 = require("../../../../src/errors");
const Authenticator_1 = require("../../../../src/lib/Authenticator");
const authorization_1 = require("../../../../src/server/middleware/authorization");
mocha_1.describe('authorization', () => {
    const sandbox = sinon.createSandbox();
    mocha_1.afterEach(() => {
        sandbox.restore();
    });
    mocha_1.it('Should pass when user contains permission access', async () => {
        const ctx = {
            state: {
                user: {
                    role: Authenticator_1.Role.user
                }
            }
        };
        const authorizationMiddleware = authorization_1.authorization([Authenticator_1.Role.user, Authenticator_1.Role.admin]);
        const spy = sandbox.spy();
        await authorizationMiddleware(ctx, spy);
        chai_1.expect(spy.calledOnce).equals(true);
    });
    mocha_1.it('Should throw PermissionError when user is not allowed', async () => {
        const ctx = {
            state: {
                user: {
                    role: Authenticator_1.Role.user
                }
            }
        };
        const authorizationMiddleware = authorization_1.authorization([Authenticator_1.Role.admin]);
        const spy = sandbox.spy();
        try {
            await authorizationMiddleware(ctx, spy);
            chai_1.expect.fail('Should throw an exception');
        }
        catch (error) {
            chai_1.expect(error).instanceof(errors_1.PermissionError);
        }
        chai_1.expect(spy.calledOnce).equals(false);
    });
});
//# sourceMappingURL=authorization.test.js.map