import { Context } from 'koa';
import { IMiddleware } from 'koa-router';
import { Authenticator } from '../../lib/Authenticator';

// eslint-disable-next-line import/prefer-default-export
export function authentication(authenticator: Authenticator): IMiddleware {
  return async (ctx: Context, next: () => Promise<any>) => {
    let token = ctx.headers.authorization ? ctx.headers.authorization : '';
    token = token.replace('Bearer ', '');
    const user = await authenticator.validate(token);
    ctx.state.user = user;
    await next();
  };
}
