import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.POSTGRES_URL}?sslmode=require`, {
  dialect: 'postgres',
});

export default sequelize;