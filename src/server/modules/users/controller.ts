import { Context } from 'koa';
import uuidAPIKey from 'uuid-apikey';
import UserManager from '../../../db/relational/managers/user';
import { CreateUser, User } from '../../../db/relational/entities/User';
import { Role, AuthUser } from '../../../lib/Authenticator';

export default class UserController {
  private manager: UserManager;

  constructor(manager: UserManager) {
    this.manager = manager;
  }

  public async create(ctx: Context) {
    const newUserData: CreateUser = ctx.request.body;

    const result = await this.manager.create(newUserData as User);

    ctx.body = {
      message: 'created',
      data: result
    };

    ctx.status = 201;
    ctx.set('location', '/api/v1/users/me');
  }

  public async login(ctx: Context) {
    ctx.body = {
      accessToken: await this.manager.login(ctx.request.body.username, ctx.request.body.password)
    };
  }

  public async createApiKey(ctx: Context) {
    const user = await this.manager.findByUsername(ctx.state.user.username);

    const key = uuidAPIKey.create();
    user.api_key = key.apiKey;

    const result = await this.manager.update(user);
    if (result.affected === 1) {
      ctx.body = { message: 'success', data: user.api_key };
      ctx.status = 200;
    } else {
      ctx.body = { message: 'error', code: 30001 };
      ctx.status = 400;
    }
  }

  public async makeAdmin(ctx: Context) {
    const user = await this.manager.findById(ctx.params.id);

    user.role = Role.admin;

    const result = await this.manager.update(user);

    if (result.affected === 1) {
      ctx.body = { message: 'success', data: user.role };
      ctx.status = 200;
    } else {
      ctx.body = { message: 'error', code: 30001 };
      ctx.status = 400;
    }
  }

  public async makeUser(ctx: Context) {
    const user = await this.manager.findById(ctx.params.id);

    user.role = Role.user;

    const result = await this.manager.update(user);

    if (result.affected === 1) {
      ctx.body = { message: 'success', data: user.role };
      ctx.status = 200;
    } else {
      ctx.body = { message: 'error', code: 30001 };
      ctx.status = 400;
    }
  }

  public async changePassword(ctx: Context) {
    const { newPassword } = ctx.request.body;
    const { oldPassword } = ctx.request.body;

    const result = await this.manager.changePassword(
      ctx.state.user.username,
      newPassword,
      oldPassword
    );
    if (result.affected === 1) {
      ctx.body = { message: 'success' };
      ctx.status = 204;
    } else {
      ctx.body = { message: 'error', code: 30001 };
      ctx.status = 400;
    }
  }

  public async get(ctx: Context) {
    const authUser: AuthUser = ctx.state.user;
    const user = await this.manager.findByUsername(authUser.username);

    ctx.body = { message: 'success', data: user };
    ctx.status = 200;
  }

  public async list(ctx: Context) {
    const users = await this.manager.findAll();

    ctx.body = { message: 'success', data: users };
    ctx.status = 200;
  }

  public async delete(ctx: Context) {
    const res = await this.manager.delete(ctx.params.id);
    if (res.affected === 1) {
      ctx.status = 204;
    } else {
      ctx.body = { message: 'error', code: 30001 };
      ctx.status = 400;
    }
  }

  public async activate(ctx: Context) {
    const res = await this.manager.activate(ctx.params.id);
    if (res.affected === 1) {
      ctx.status = 204;
    } else {
      ctx.body = { message: 'error', code: 30001 };
      ctx.status = 400;
    }
  }

  public async deactivate(ctx: Context) {
    if (Number(ctx.params.id) === Number(ctx.state.user.id)) {
      ctx.status = 400;
      return;
    }
    const res = await this.manager.deactivate(ctx.params.id);
    if (res.affected === 1) {
      ctx.status = 204;
    } else {
      ctx.body = { message: 'error', code: 30001 };
      ctx.status = 400;
    }
  }
}
