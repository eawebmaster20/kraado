import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Bookings e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  it('/bookings (POST) happy path', async () => {
    // Replace with a valid JWT for your test user
    const token = 'Bearer test.jwt.token';
    const payload = {
      clientName: 'Test User',
      clientPhone: '+1234567890',
      service: 'MANICURE',
      startsAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    };
    const res = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', token)
      .send(payload)
      .expect(201);
    expect(res.body).toHaveProperty('id');
  });

  afterAll(async () => {
    await app.close();
  });
});
