"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const user_1 = __importDefault(require("../db/relational/repositories/user"));
const errors_1 = require("../errors");
var Role;
(function (Role) {
    Role["user"] = "user";
    Role["admin"] = "admin";
})(Role = exports.Role || (exports.Role = {}));
class JWTAuthenticator {
    constructor() {
        this.secret = process.env.SECRET_KEY || 'secret';
    }
    async validate(token) {
        try {
            const decode = jwt.verify(token, this.secret);
            const user = await typeorm_1.getCustomRepository(user_1.default).findByUsername(decode.username);
            if (!user.activated) {
                throw new errors_1.ActivationError();
            }
            return {
                id: user.id,
                username: user.username,
                role: user.role
            };
        }
        catch (err) {
            throw new errors_1.UnauthorizedError(err);
        }
    }
    authenticate(user) {
        return jwt.sign({ id: user.id, username: user.username, role: user.role, activated: user.activated }, this.secret, {
            expiresIn: 60 * 60
        });
    }
}
exports.JWTAuthenticator = JWTAuthenticator;
//# sourceMappingURL=Authenticator.js.map