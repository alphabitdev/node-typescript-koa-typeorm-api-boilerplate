import { ErrorCallback, retry } from 'async';
import { Server } from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import pino from 'pino';
import requestId from 'koa-requestid';
import { AppError } from '../errors';
import health from './modules/health';
import users from './modules/users';
import responseTime from './middleware/response-time';
import errorHandler from './middleware/error-handler';
import logRequest from './middleware/log-request';
import HealthMonitor from '../lib/HealthMonitor';
import config from './config';
import { BCryptHasher } from '../lib/Hasher';
import { JWTAuthenticator } from '../lib/Authenticator';
import UserManager from '../db/relational/managers/user';

export default class KoaServer {
  private app: Koa;

  private server!: Server;

  private logger: pino.Logger;

  private healthMonitor: HealthMonitor;

  private userManager: UserManager;

  constructor(logger: pino.Logger) {
    this.app = new Koa();
    this.logger = logger;
    this.healthMonitor = new HealthMonitor();
    this.userManager = new UserManager(new BCryptHasher(), new JWTAuthenticator());
  }

  public init() {
    // this.registerProcessEvents();
    this.registerMiddlewares();
    this.registerModules();
  }

  public listen(port: number): Server {
    this.server = this.app.listen(port);
    return this.server;
  }

  public getServer(): Server {
    return this.server;
  }

  public getHealthMonitor(): HealthMonitor {
    return this.healthMonitor;
  }

  private registerMiddlewares() {
    this.app.use(helmet());
    this.app.use(requestId());
    this.app.use(responseTime);

    this.app.use(logRequest(this.logger));
    this.app.use(errorHandler(this.logger));
    this.app.use(bodyParser(config.bodyParser));
    this.app.use(cors(config.corsConfig));
  }

  private registerModules() {
    health(this.app, this.healthMonitor);
    users(this.app, this.userManager);
  }

  public closeServer(): Promise<void> {
    if (this.server === undefined) {
      throw new AppError(10001, 'Server is not initialized.');
    }

    const checkPendingRequests = (callback: ErrorCallback<Error | undefined>) => {
      this.server.getConnections((err: Error | null, pendingRequests: number) => {
        if (err) {
          callback(err);
        } else if (pendingRequests > 0) {
          callback(Error(`Number of pending requests: ${pendingRequests}`));
        } else {
          callback(undefined);
        }
      });
    };

    return new Promise<void>((resolve, reject) => {
      retry(
        { times: 10, interval: 1000 },
        checkPendingRequests.bind(this),
        (error: Error | undefined | null) => {
          if (error) {
            this.server.close(() => reject(error));
          } else {
            this.server.close(() => resolve());
          }
        }
      );
    });
  }
}
