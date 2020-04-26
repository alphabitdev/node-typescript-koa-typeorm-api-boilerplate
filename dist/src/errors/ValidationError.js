"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("./AppError"));
class ValidationError extends AppError_1.default {
    constructor(message, error) {
        super(30000, message, error);
    }
}
exports.default = ValidationError;
//# sourceMappingURL=ValidationError.js.map