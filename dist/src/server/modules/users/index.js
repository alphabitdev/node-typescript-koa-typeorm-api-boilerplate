"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const joi_1 = __importDefault(require("joi"));
const Authenticator_1 = require("../../../lib/Authenticator");
const controller_1 = __importDefault(require("./controller"));
const validator_1 = __importDefault(require("../../middleware/validator"));
const validators = __importStar(require("./validators"));
const authorization_1 = require("../../middleware/authorization");
const authentication_1 = require("../../middleware/authentication");
exports.default = (server, userManager) => {
    const controller = new controller_1.default(userManager);
    const router = new koa_router_1.default({ prefix: '/api/v1/users' });
    router.get('/me', authentication_1.authentication(userManager.getAuthenticator()), authorization_1.authorization([Authenticator_1.Role.user, Authenticator_1.Role.admin]), controller.get.bind(controller));
    router.post('/', validator_1.default({ request: { body: validators.createUser } }), controller.create.bind(controller));
    router.post('/login', validator_1.default({ request: { body: validators.login } }), controller.login.bind(controller));
    router.get('/createapikey', authentication_1.authentication(userManager.getAuthenticator()), authorization_1.authorization([Authenticator_1.Role.user, Authenticator_1.Role.admin]), 
    // validate({ request: { body: validators.createApi } }),
    controller.createApiKey.bind(controller));
    router.put('/password', authentication_1.authentication(userManager.getAuthenticator()), authorization_1.authorization([Authenticator_1.Role.user, Authenticator_1.Role.admin]), validator_1.default({
        request: {
            body: validators.changePass
        }
    }), controller.changePassword.bind(controller));
    router.get('/', authentication_1.authentication(userManager.getAuthenticator()), authorization_1.authorization([Authenticator_1.Role.admin]), controller.list.bind(controller));
    router.delete('/:id', authentication_1.authentication(userManager.getAuthenticator()), authorization_1.authorization([Authenticator_1.Role.admin]), validator_1.default({
        params: { id: joi_1.default.number().required() }
    }), controller.delete.bind(controller));
    router.get('/makeadmin/:id', authentication_1.authentication(userManager.getAuthenticator()), authorization_1.authorization([Authenticator_1.Role.admin]), validator_1.default({
        params: { id: joi_1.default.number().required() }
    }), controller.makeAdmin.bind(controller));
    router.get('/makeuser/:id', authentication_1.authentication(userManager.getAuthenticator()), authorization_1.authorization([Authenticator_1.Role.admin]), validator_1.default({
        params: { id: joi_1.default.number().required() }
    }), controller.makeUser.bind(controller));
    router.get('/activate/:id', authentication_1.authentication(userManager.getAuthenticator()), authorization_1.authorization([Authenticator_1.Role.admin]), validator_1.default({
        params: { id: joi_1.default.number().required() }
    }), controller.activate.bind(controller));
    router.get('/deactivate/:id', authentication_1.authentication(userManager.getAuthenticator()), authorization_1.authorization([Authenticator_1.Role.admin]), validator_1.default({
        params: { id: joi_1.default.number().required() }
    }), controller.deactivate.bind(controller));
    server.use(router.routes());
};
//# sourceMappingURL=index.js.map