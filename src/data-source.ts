import { DataSource } from 'typeorm';
import { Booking } from './bookings/booking.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Booking],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
});
