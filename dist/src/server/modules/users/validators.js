"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
exports.createUser = {
    username: Joi.string()
        .trim()
        .required(),
    password: Joi.string()
        .trim()
        .required()
};
exports.changePass = {
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
};
exports.login = {
    username: Joi.string()
        .trim()
        .required(),
    password: Joi.string()
        .trim()
        .required()
};
//# sourceMappingURL=validators.js.map