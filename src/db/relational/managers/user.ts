/* eslint-disable class-methods-use-this */
import { DeleteResult, UpdateResult, getCustomRepository } from 'typeorm';
import { User } from '../entities/User';
import { ValidationError } from '../../../errors';
import { Authenticator } from '../../../lib/Authenticator';
import { Hasher } from '../../../lib/Hasher';
import UserRepository from '../repositories/user';
import ActivationError from '../../../errors/ActivationError';

export default class UserManager {
  private hasher: Hasher;

  private auth: Authenticator;

  constructor(hasher: Hasher, auth: Authenticator) {
    this.hasher = hasher;
    this.auth = auth;
  }

  public getAuthenticator() {
    return this.auth;
  }

  public async findByUsername(username: string): Promise<User> {
    return getCustomRepository(UserRepository).findByUsername(username);
  }

  public async findById(id: number): Promise<User> {
    return getCustomRepository(UserRepository).findById(id);
  }

  public async findAll(): Promise<Array<User>> {
    return getCustomRepository(UserRepository).findAll();
  }

  public async create(user: User) {
    const hashPassword = await this.hasher.hashPassword(user.password);

    // eslint-disable-next-line no-param-reassign
    user.password = hashPassword;
    return getCustomRepository(UserRepository).createNew(user);
  }

  public async update(user: User) {
    return getCustomRepository(UserRepository).update(
      { id: user.id },
      { role: user.role, api_key: user.api_key, activated: user.activated, name: user.name }
    );
  }

  public async login(username: string, password: string): Promise<string> {
    let user;
    try {
      user = await getCustomRepository(UserRepository).findByUsername(username);
    } catch (e) {
      throw new ValidationError('Wrong credentials');
    }
    if (!user.activated) {
      throw new ActivationError();
    }
    if (await this.hasher.verifyPassword(password, user.password)) {
      return this.auth.authenticate(user);
    }

    throw new ValidationError('Wrong credentials');
  }

  public async changePassword(
    username: string,
    newPassword: string,
    oldPassword: string
  ): Promise<UpdateResult> {
    const user = await getCustomRepository(UserRepository).findByUsername(username);
    const validPassword = await this.hasher.verifyPassword(oldPassword, user.password);

    if (!validPassword) {
      throw new ValidationError('Old password is not correct');
    }

    const hashPassword = await this.hasher.hashPassword(newPassword);

    return getCustomRepository(UserRepository).changePassword(username, hashPassword);
  }

  public delete(userId: number): Promise<DeleteResult> {
    return getCustomRepository(UserRepository).delete(userId);
  }

  public activate(userId: number): Promise<UpdateResult> {
    return getCustomRepository(UserRepository).activate(userId);
  }

  public deactivate(userId: number): Promise<UpdateResult> {
    return getCustomRepository(UserRepository).deactivate(userId);
  }
}
