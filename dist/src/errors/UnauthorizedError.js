"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("./AppError"));
class UnauthorizedError extends AppError_1.default {
    constructor(error) {
        super(30002, 'Unauthorized user', error);
    }
}
exports.default = UnauthorizedError;
//# sourceMappingURL=UnauthorizedError.js.map