"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
// eslint-disable-next-line import/prefer-default-export
function authorization(roles) {
    return async (ctx, next) => {
        const { user } = ctx.state;
        if (roles.indexOf(user.role) < 0) {
            throw new errors_1.PermissionError();
        }
        await next();
    };
}
exports.authorization = authorization;
//# sourceMappingURL=authorization.js.map