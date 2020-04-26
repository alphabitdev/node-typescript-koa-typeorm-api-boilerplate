"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const typeorm_1 = require("typeorm");
const KoaServer_1 = __importDefault(require("./server/KoaServer"));
const config_1 = __importDefault(require("./db/config"));
const logger = pino_1.default();
const registerProcessEvents = (koaServer) => {
    process.on('uncaughtException', (error) => {
        logger.error('UncaughtException', error);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.on('unhandledRejection', (reason, promise) => {
        logger.info(reason, promise);
    });
    process.on('SIGTERM', async () => {
        logger.info('Starting graceful shutdown');
        koaServer.getHealthMonitor().shuttingDown();
        let exitCode = 0;
        try {
            await koaServer.closeServer();
            await typeorm_1.getConnection().close();
        }
        catch (e) {
            logger.error('Error in graceful shutdown ', e);
            exitCode = 1;
        }
        process.exit(exitCode);
    });
};
// eslint-disable-next-line import/prefer-default-export
async function init() {
    const rdbOptions = process.env.NODE_ENV === 'production'
        ? config_1.default.relational.production
        : config_1.default.relational.development;
    try {
        await typeorm_1.createConnection(rdbOptions);
        await typeorm_1.getConnection().query("SET TIME ZONE 'UTC'");
        logger.info(`RDB connection created ${rdbOptions.type} ${rdbOptions.host}:${rdbOptions.port} ${rdbOptions.username}`);
    }
    catch (e) {
        logger.error(e, `An error occurred while initializing RDB connection.${rdbOptions.type} ${rdbOptions.host}:${rdbOptions.port} ${rdbOptions.username}`);
    }
    try {
        // Starting the HTTP server
        const port = Number(process.env.PORT) || 8080;
        const koaServer = new KoaServer_1.default(logger);
        koaServer.init();
        koaServer.listen(port);
        logger.info(`HTTP KOA API server running on port: ${port}`);
        registerProcessEvents(koaServer);
    }
    catch (e) {
        logger.error(e, 'An error occurred while initializing koa server.');
    }
}
exports.init = init;
init();
//# sourceMappingURL=index.js.map