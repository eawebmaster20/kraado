import { Injectable } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import type { Queue } from 'bull';
import type { Job } from 'bull';

@Injectable()
@Processor('reminders')
export class JobsService {
	constructor(@InjectQueue('reminders') private remindersQueue: Queue) {}

	async addReminderJob(booking: any) {
		const remindAt = new Date(new Date(booking.startsAt).getTime() - 10 * 60 * 1000);
		await this.remindersQueue.add('remind', booking, { delay: remindAt.getTime() - Date.now() });
	}

	@Process('remind')
	async processReminder(job: Job) {
		// TODO: send reminder (e.g., WebSocket, SMS, etc.)
		console.log('Reminder for booking', job.data.id);
	}
}
