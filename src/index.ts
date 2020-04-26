import pino from 'pino';
import { createConnection, getConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import KoaServer from './server/KoaServer';
import config from './db/config';

const logger = pino();

const registerProcessEvents = (koaServer: KoaServer) => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('UncaughtException', error);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  process.on('unhandledRejection', (reason: any, promise: any) => {
    logger.info(reason, promise);
  });

  process.on('SIGTERM', async () => {
    logger.info('Starting graceful shutdown');

    koaServer.getHealthMonitor().shuttingDown();

    let exitCode = 0;

    try {
      await koaServer.closeServer();
      await getConnection().close();
    } catch (e) {
      logger.error('Error in graceful shutdown ', e);
      exitCode = 1;
    }

    process.exit(exitCode);
  });
};

// eslint-disable-next-line import/prefer-default-export
export async function init() {
  const rdbOptions: PostgresConnectionOptions =
    process.env.NODE_ENV === 'production'
      ? config.relational.production
      : config.relational.development;

  try {
    await createConnection(rdbOptions);
    await getConnection().query("SET TIME ZONE 'UTC'");
    logger.info(
      `RDB connection created ${rdbOptions.type} ${rdbOptions.host}:${rdbOptions.port} ${rdbOptions.username}`
    );
  } catch (e) {
    logger.error(
      e,
      `An error occurred while initializing RDB connection.${rdbOptions.type} ${rdbOptions.host}:${rdbOptions.port} ${rdbOptions.username}`
    );
  }

  try {
    // Starting the HTTP server
    const port = Number(process.env.PORT) || 8080;
    const koaServer = new KoaServer(logger);
    koaServer.init();
    koaServer.listen(port);
    logger.info(`HTTP KOA API server running on port: ${port}`);
    registerProcessEvents(koaServer);
  } catch (e) {
    logger.error(e, 'An error occurred while initializing koa server.');
  }
}

init();
