"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/prefer-default-export
function authentication(authenticator) {
    return async (ctx, next) => {
        let token = ctx.headers.authorization ? ctx.headers.authorization : '';
        token = token.replace('Bearer ', '');
        const user = await authenticator.validate(token);
        ctx.state.user = user;
        await next();
    };
}
exports.authentication = authentication;
//# sourceMappingURL=authentication.js.map