import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';
pg.defaults.parseInt8 = true;

dotenv.config();

const sequelize = new Sequelize(`${process.env.POSTGRES_URL}?sslmode=require`, {
  dialect: 'postgres',
});

export default sequelize;