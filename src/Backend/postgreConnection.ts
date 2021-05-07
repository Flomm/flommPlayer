import * as pg from 'pg';

export const client: pg.Client = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'player',
  password: '123',
  port: 5432,
});
