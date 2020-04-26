"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const base = {
    type: 'postgres',
    username: process.env.RDB_USER,
    password: process.env.RDB_PASS,
    synchronize: true,
    logger: 'advanced-console',
    entities: ['dist/src/db/relational/entities/*.js'],
    subscribers: ['dist/src/db/subscribers/*.js'],
    migrations: ['dist/src/db/relational/migrations/*.js'],
    cli: {
        entitiesDir: 'dist/src/db/relational/entities',
        migrationsDir: 'dist/src/db/relational/migrations',
        subscribersDir: 'dist/src/db/relational/subscribers'
    }
};
const config = {
    relational: {
        development: {
            host: 'localhost',
            port: 5432,
            database: 'alphabit',
            ...base
        },
        production: {
            host: 'db-postgresql-do-user-7346699-0.a.db.ondigitalocean.com',
            port: 25060,
            database: 'livedb',
            ssl: {
                ca: fs.readFileSync('ca-certificate.crt').toString()
            },
            ...base
        },
        test: {
            host: 'localhost',
            port: 5432,
            database: 'alphabittest',
            ...base
        }
    }
};
exports.default = config;
//# sourceMappingURL=config.js.map