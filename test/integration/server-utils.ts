import pino from 'pino';
import { getCustomRepository, UpdateResult } from 'typeorm';
import supertest from 'supertest';
import UserRepository from '../../src/db/relational/repositories/user';
import { Role } from '../../src/lib/Authenticator';
import { CreateUser, User } from '../../src/db/relational/entities/User';
import KoaServer from '../../src/server/KoaServer';

const logger = pino({ name: 'test', level: 'silent' });

const port = Number(process.env.PORT) || 8080;
const koaServer = new KoaServer(logger);
koaServer.init();
export const testServer = koaServer.listen(port);

export function shuttingDown(): void {
  koaServer.getHealthMonitor().shuttingDown();
}
export function end() {
  return koaServer.closeServer();
}

export async function createUserTest(newUser: CreateUser): Promise<User> {
  await supertest(testServer).post('/api/v1/users').send(newUser).expect(201);
  const repo = getCustomRepository(UserRepository);
  const user = await repo.findByUsername(newUser.username);
  await repo.activate(user.id);
  return user;
}
export async function createAdminTest(newUser: CreateUser): Promise<User> {
  const user = await createUserTest(newUser);
  await getCustomRepository(UserRepository).update({ id: user.id }, { role: Role.admin });
  return user;
}

export async function getLoginToken(username: string, password: string): Promise<string> {
  const res = await supertest(testServer)
    .post('/api/v1/users/login')
    .send({ username, password })
    .expect(200);

  return res.body.accessToken;
}

export async function deactivateUser(username: string): Promise<UpdateResult> {
  const user = await getCustomRepository(UserRepository).findByUsername(username);
  return getCustomRepository(UserRepository).deactivate(user.id);
}

export async function activateUser(username: string): Promise<UpdateResult> {
  const user = await getCustomRepository(UserRepository).findByUsername(username);
  return getCustomRepository(UserRepository).activate(user.id);
}
