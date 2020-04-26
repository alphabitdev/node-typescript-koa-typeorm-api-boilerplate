import { EntityRepository, Repository, DeleteResult, UpdateResult } from 'typeorm';
import { ValidationError } from '../../../errors';
import { User, CreateUser } from '../entities/User';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  public async findByUsername(username: string) {
    return this.findOneOrFail({ username });
  }

  public async findById(id: number) {
    return this.findOneOrFail({ id });
  }

  public async updateApiKey(user: User) {
    return super.update({ id: user.id }, { api_key: user.api_key });
  }

  public async activate(id: number) {
    return super.update({ id }, { activated: true });
  }

  public async deactivate(id: number) {
    return super.update({ id }, { activated: false });
  }

  public async updateRole(user: User) {
    return super.update({ id: user.id }, { role: user.role });
  }

  public async findAll() {
    return super.find();
  }

  public async createNew(user: CreateUser) {
    try {
      return await this.insert(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new ValidationError(`Username ${user.username} already exists`, err);
      }
      throw err;
    }
  }

  public async changePassword(username: string, newPass: string): Promise<UpdateResult> {
    return super.update({ username }, { password: newPass });
  }

  public delete(userId: number): Promise<DeleteResult> {
    return super.delete({ id: userId });
  }
}
