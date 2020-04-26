import { Context } from 'koa';
import { IMiddleware } from 'koa-router';
import { PermissionError } from '../../errors';
import { Role } from '../../lib/Authenticator';

// eslint-disable-next-line import/prefer-default-export
export function authorization(roles: Role[]): IMiddleware {
  return async (ctx: Context, next: () => Promise<any>) => {
    const { user } = ctx.state;

    if (roles.indexOf(user.role) < 0) {
      throw new PermissionError();
    }

    await next();
  };
}
