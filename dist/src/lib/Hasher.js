"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable class-methods-use-this */
const bcrypt = __importStar(require("bcryptjs"));
class BCryptHasher {
    async hashPassword(password) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hash(password, salt);
    }
    verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
}
exports.BCryptHasher = BCryptHasher;
//# sourceMappingURL=Hasher.js.map