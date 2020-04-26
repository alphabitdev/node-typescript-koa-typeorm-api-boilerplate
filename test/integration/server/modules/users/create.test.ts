import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import supertest, { SuperTest, Test } from 'supertest';
// import { CreateUser } from '../../../../src/db/entities/User';
import { truncateTables } from '../../../database-utils';
import { testServer } from '../../../server-utils';
import { CreateUser } from '../../../../../src/db/relational/entities/User';

describe('POST /api/v1/users', () => {
  const app: SuperTest<Test> = supertest(testServer);
  beforeEach(async () => {
    await truncateTables(['user']);
  });

  it('Should create a valid user and return 201', async () => {
    const user: CreateUser = {
      username: 'dummy@gmail.com',
      password: '123123123'
    };

    const res = await app
      .post('/api/v1/users')
      .send(user)
      .expect(201);

    expect(res.header.location).equals('/api/v1/users/me');
    expect(res.body).includes({
      message: 'created'
    });
  });

  it('Should return 400 when duplicate username', async () => {
    const user: CreateUser = {
      username: 'dummy@gmail.com',
      password: '123123123'
    };

    let res = await app
      .post('/api/v1/users')
      .send(user)
      .expect(201);

    res = await app
      .post('/api/v1/users')
      .send(user)
      .expect(400);

    expect(res.body).eql({
      code: 30000,
      message: 'Username dummy@gmail.com already exists'
    });
  });
  it('Should return 400 when missing username', async () => {
    const user = {
      password: 'dummy1@gmail.com'
    };

    const res = await app
      .post('/api/v1/users')
      .send(user)
      .expect(400);

    expect(res.body.code).equals(30001);
    expect(res.body.fields.length).equals(1);
    expect(res.body.fields[0].message).eql('"username" is required');
  });

  it('Should return 400 when missing password', async () => {
    const user = {
      username: 'dummy1@gmail.com'
    };

    const res = await app
      .post('/api/v1/users')
      .send(user)
      .expect(400);

    expect(res.body.code).equals(30001);
    expect(res.body.fields.length).equals(1);
    expect(res.body.fields[0].message).eql('"password" is required');
  });
});
