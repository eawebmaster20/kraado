
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsService } from './jobs.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reminders',
    }),
  ],
  providers: [JobsService],
})
export class JobsModule {}
