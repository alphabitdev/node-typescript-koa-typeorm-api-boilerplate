import Koa from 'koa';
import Router from 'koa-router';
import Joi from 'joi';
import { Role } from '../../../lib/Authenticator';
import UserController from './controller';
import UserManager from '../../../db/relational/managers/user';
import validate from '../../middleware/validator';
import * as validators from './validators';
import { authorization } from '../../middleware/authorization';
import { authentication } from '../../middleware/authentication';

export default (server: Koa, userManager: UserManager) => {
  const controller = new UserController(userManager);
  const router = new Router({ prefix: '/api/v1/users' });

  router.get(
    '/me',
    authentication(userManager.getAuthenticator()),
    authorization([Role.user, Role.admin]),
    controller.get.bind(controller)
  );

  router.post(
    '/',
    validate({ request: { body: validators.createUser } }),
    controller.create.bind(controller)
  );

  router.post(
    '/login',
    validate({ request: { body: validators.login } }),
    controller.login.bind(controller)
  );

  router.get(
    '/createapikey',
    authentication(userManager.getAuthenticator()),
    authorization([Role.user, Role.admin]),
    // validate({ request: { body: validators.createApi } }),
    controller.createApiKey.bind(controller)
  );

  router.put(
    '/password',
    authentication(userManager.getAuthenticator()),
    authorization([Role.user, Role.admin]),
    validate({
      request: {
        body: validators.changePass
      }
    }),
    controller.changePassword.bind(controller)
  );
  router.get(
    '/',
    authentication(userManager.getAuthenticator()),
    authorization([Role.admin]),
    controller.list.bind(controller)
  );

  router.delete(
    '/:id',
    authentication(userManager.getAuthenticator()),
    authorization([Role.admin]),
    validate({
      params: { id: Joi.number().required() }
    }),
    controller.delete.bind(controller)
  );

  router.get(
    '/makeadmin/:id',
    authentication(userManager.getAuthenticator()),
    authorization([Role.admin]),
    validate({
      params: { id: Joi.number().required() }
    }),
    controller.makeAdmin.bind(controller)
  );

  router.get(
    '/makeuser/:id',
    authentication(userManager.getAuthenticator()),
    authorization([Role.admin]),
    validate({
      params: { id: Joi.number().required() }
    }),
    controller.makeUser.bind(controller)
  );

  router.get(
    '/activate/:id',
    authentication(userManager.getAuthenticator()),
    authorization([Role.admin]),
    validate({
      params: { id: Joi.number().required() }
    }),
    controller.activate.bind(controller)
  );
  router.get(
    '/deactivate/:id',
    authentication(userManager.getAuthenticator()),
    authorization([Role.admin]),
    validate({
      params: { id: Joi.number().required() }
    }),
    controller.deactivate.bind(controller)
  );

  server.use(router.routes());
};
