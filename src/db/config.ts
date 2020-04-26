import { ConnectionOptions } from 'typeorm';
import * as fs from 'fs';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export interface DatabaseConfig {
  relational: {
    development: PostgresConnectionOptions;
    production: PostgresConnectionOptions;
    test: PostgresConnectionOptions;
  };
}

const base: PostgresConnectionOptions = {
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

const config: DatabaseConfig = {
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

export default config;
