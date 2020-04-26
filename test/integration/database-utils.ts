import {
  getRepository,
  getCustomRepository,
  UpdateResult,
  createConnection,
  getConnection,
  ConnectionOptions
} from 'typeorm';
import * as fs from 'fs';
import UserRepository from '../../src/db/relational/repositories/user';
import { Role } from '../../src/lib/Authenticator';
import config from '../../src/db/config';

const rdbOptions: ConnectionOptions = config.relational.test;

export async function connectDatabase() {
  await createConnection(rdbOptions);
  await getConnection().query("SET TIME ZONE 'UTC'");
}
export async function closeDatabase() {
  await getConnection().close();
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export async function truncateTables(tables: string[]) {
  // eslint-disable-next-line no-restricted-syntax
  for (const table of tables) {
    // eslint-disable-next-line no-await-in-loop
    await getRepository(capitalize(table)).clear();
  }
}

export async function setAdminMode(username: string): Promise<UpdateResult> {
  return getCustomRepository(UserRepository).update({ username }, { role: Role.admin });
}

export async function removeAdminMode(username: string): Promise<UpdateResult> {
  return getCustomRepository(UserRepository).update({ username }, { role: Role.user });
}
