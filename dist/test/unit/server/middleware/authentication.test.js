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
const authentication_1 = require("../../../../src/server/middleware/authentication");
mocha_1.describe('authentication', () => {
    const sandbox = sinon.createSandbox();
    mocha_1.afterEach(() => {
        sandbox.restore();
    });
    mocha_1.it('Should set context with the user data', async () => {
        const ctx = {
            headers: {
                authorization: 'jwt token'
            },
            state: {}
        };
        const fakeAuthenticator = {
            validate: sandbox.stub().returns({
                id: 1,
                name: 'me',
                role: Authenticator_1.Role.admin
            })
        };
        const spy = sandbox.spy();
        const authenticationMiddleware = authentication_1.authentication(fakeAuthenticator);
        await authenticationMiddleware(ctx, spy);
        chai_1.expect(fakeAuthenticator.validate.calledOnce).equals(true);
        chai_1.expect(ctx.state.user).eql({
            id: 1,
            name: 'me',
            role: Authenticator_1.Role.admin
        });
        chai_1.expect(spy.calledOnce).eql(true);
    });
    mocha_1.it('Should throw UnauthorizedError', async () => {
        const ctx = {
            headers: {
                authorization: 'jwt token'
            },
            state: {}
        };
        const fakeAuthenticator = {
            validate: sandbox.stub().throws(new errors_1.UnauthorizedError())
        };
        const spy = sandbox.spy();
        const authenticationMiddleware = authentication_1.authentication(fakeAuthenticator);
        try {
            await authenticationMiddleware(ctx, spy);
        }
        catch (error) {
            chai_1.expect(error).instanceof(errors_1.UnauthorizedError);
        }
        chai_1.expect(fakeAuthenticator.validate.calledOnce).equals(true);
        chai_1.expect(spy.calledOnce).eql(false);
    });
});
//# sourceMappingURL=authentication.test.js.map