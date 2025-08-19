
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './create-booking.dto';
import { WsGateway } from './ws/ws.gateway';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class BookingsService {
			constructor(
				@InjectRepository(Booking)
				private readonly bookingRepo: Repository<Booking>,
				private readonly wsGateway: WsGateway,
				private readonly jobsService: JobsService,
			) {}

		async create(dto: CreateBookingDto, userId: number) {
			// Convert startsAt to Date if needed
			const booking = this.bookingRepo.create({
				...dto,
				startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
				status: 'pending',
			});
			const saved = await this.bookingRepo.save(booking);
			this.wsGateway.notifyBookingCreated(saved);
			await this.jobsService.addReminderJob(saved);
			return saved;
		}

	async findById(id: number) {
		return this.bookingRepo.findOne({ where: { id } });
	}

	async listUpcoming(userId: number, page = 1, limit = 10) {
		const now = new Date();
			return this.bookingRepo.find({
				where: { startsAt: MoreThan(now) },
				order: { startsAt: 'ASC' },
				skip: (page - 1) * limit,
				take: limit,
			});
	}

	async listPast(userId: number, page = 1, limit = 10) {
		const now = new Date();
			return this.bookingRepo.find({
				where: { startsAt: LessThan(now) },
				order: { startsAt: 'DESC' },
				skip: (page - 1) * limit,
				take: limit,
			});
	}
}
