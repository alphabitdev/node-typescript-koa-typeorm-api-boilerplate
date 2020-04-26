"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("async");
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const koa_requestid_1 = __importDefault(require("koa-requestid"));
const errors_1 = require("../errors");
const health_1 = __importDefault(require("./modules/health"));
const users_1 = __importDefault(require("./modules/users"));
const response_time_1 = __importDefault(require("./middleware/response-time"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const log_request_1 = __importDefault(require("./middleware/log-request"));
const HealthMonitor_1 = __importDefault(require("../lib/HealthMonitor"));
const config_1 = __importDefault(require("./config"));
const Hasher_1 = require("../lib/Hasher");
const Authenticator_1 = require("../lib/Authenticator");
const user_1 = __importDefault(require("../db/relational/managers/user"));
class KoaServer {
    constructor(logger) {
        this.app = new koa_1.default();
        this.logger = logger;
        this.healthMonitor = new HealthMonitor_1.default();
        this.userManager = new user_1.default(new Hasher_1.BCryptHasher(), new Authenticator_1.JWTAuthenticator());
    }
    init() {
        // this.registerProcessEvents();
        this.registerMiddlewares();
        this.registerModules();
    }
    listen(port) {
        this.server = this.app.listen(port);
        return this.server;
    }
    getServer() {
        return this.server;
    }
    getHealthMonitor() {
        return this.healthMonitor;
    }
    registerMiddlewares() {
        this.app.use(koa_helmet_1.default());
        this.app.use(koa_requestid_1.default());
        this.app.use(response_time_1.default);
        this.app.use(log_request_1.default(this.logger));
        this.app.use(error_handler_1.default(this.logger));
        this.app.use(koa_bodyparser_1.default(config_1.default.bodyParser));
        this.app.use(cors_1.default(config_1.default.corsConfig));
    }
    registerModules() {
        health_1.default(this.app, this.healthMonitor);
        users_1.default(this.app, this.userManager);
    }
    closeServer() {
        if (this.server === undefined) {
            throw new errors_1.AppError(10001, 'Server is not initialized.');
        }
        const checkPendingRequests = (callback) => {
            this.server.getConnections((err, pendingRequests) => {
                if (err) {
                    callback(err);
                }
                else if (pendingRequests > 0) {
                    callback(Error(`Number of pending requests: ${pendingRequests}`));
                }
                else {
                    callback(undefined);
                }
            });
        };
        return new Promise((resolve, reject) => {
            async_1.retry({ times: 10, interval: 1000 }, checkPendingRequests.bind(this), (error) => {
                if (error) {
                    this.server.close(() => reject(error));
                }
                else {
                    this.server.close(() => resolve());
                }
            });
        });
    }
}
exports.default = KoaServer;
//# sourceMappingURL=KoaServer.js.map