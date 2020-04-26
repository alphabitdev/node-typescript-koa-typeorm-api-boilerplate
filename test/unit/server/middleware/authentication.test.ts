import { expect } from 'chai';
import * as sinon from 'sinon';
import { describe, afterEach, it } from 'mocha';
import { UnauthorizedError } from '../../../../src/errors';
import { Role } from '../../../../src/lib/Authenticator';
import { authentication } from '../../../../src/server/middleware/authentication';

describe('authentication', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('Should set context with the user data', async () => {
    const ctx: any = {
      headers: {
        authorization: 'jwt token'
      },
      state: {}
    };

    const fakeAuthenticator: any = {
      validate: sandbox.stub().returns({
        id: 1,
        name: 'me',
        role: Role.admin
      })
    };

    const spy = sandbox.spy();
    const authenticationMiddleware = authentication(fakeAuthenticator);

    await authenticationMiddleware(ctx, spy);

    expect(fakeAuthenticator.validate.calledOnce).equals(true);
    expect(ctx.state.user).eql({
      id: 1,
      name: 'me',
      role: Role.admin
    });
    expect(spy.calledOnce).eql(true);
  });

  it('Should throw UnauthorizedError', async () => {
    const ctx: any = {
      headers: {
        authorization: 'jwt token'
      },
      state: {}
    };

    const fakeAuthenticator: any = {
      validate: sandbox.stub().throws(new UnauthorizedError())
    };

    const spy = sandbox.spy();
    const authenticationMiddleware = authentication(fakeAuthenticator);

    try {
      await authenticationMiddleware(ctx, spy);
    } catch (error) {
      expect(error).instanceof(UnauthorizedError);
    }

    expect(fakeAuthenticator.validate.calledOnce).equals(true);
    expect(spy.calledOnce).eql(false);
  });
});
