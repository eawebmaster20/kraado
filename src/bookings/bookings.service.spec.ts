import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { ServiceType } from './service-type.enum';

describe('BookingsService', () => {
  let service: BookingsService;
  let repo: { save: jest.Mock };

  beforeEach(async () => {
    repo = { save: jest.fn().mockResolvedValue({ id: 1 }) };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: repo },
        { provide: 'WsGateway', useValue: { notifyBookingCreated: jest.fn() } },
        { provide: 'JobsService', useValue: { addReminderJob: jest.fn() } },
      ],
    }).compile();
    service = module.get<BookingsService>(BookingsService);
  });

  it('should create a booking', async () => {
  const dto = { clientName: 'Test', clientPhone: '+1234567890', service: ServiceType.MANICURE, startsAt: new Date() };
    const result = await service.create(dto, 1);
    expect(result).toHaveProperty('id');
    expect(repo.save).toHaveBeenCalled();
  });
});
