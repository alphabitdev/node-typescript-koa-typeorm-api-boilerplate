import { before, after } from 'mocha';
import { connectDatabase, closeDatabase } from './database-utils';
import { end } from './server-utils';

before(async () => {
  console.log('Initializing database');
  await connectDatabase();
});
after(async () => {
  await closeDatabase();
  end();
});
