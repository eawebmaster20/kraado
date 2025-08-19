

import { Controller, Post, Get, Body, UsePipes, ValidationPipe, UseGuards, Request, Param, Query } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './create-booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { SetMetadata } from '@nestjs/common';

// Roles decorator
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('bookings')
export class BookingsController {
	constructor(private readonly bookingsService: BookingsService) {}

	@Post()
	@Roles('provider', 'admin')
	@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
	create(@Body() dto: CreateBookingDto, @Request() req: ExpressRequest & { user: any }) {
		return this.bookingsService.create(dto, req.user.sub);
	}

	@Get(':id')
	@Roles('provider', 'admin')
	getById(@Request() req: ExpressRequest & { user: any }, @Param('id') id: number) {
		return this.bookingsService.findById(id);
	}

	@Get('upcoming')
	@Roles('provider', 'admin')
	listUpcoming(@Request() req: ExpressRequest & { user: any }, @Query('page') page = 1, @Query('limit') limit = 10) {
		return this.bookingsService.listUpcoming(req.user.sub, Number(page), Number(limit));
	}

	@Get('past')
	@Roles('provider', 'admin')
	listPast(@Request() req: ExpressRequest & { user: any }, @Query('page') page = 1, @Query('limit') limit = 10) {
		return this.bookingsService.listPast(req.user.sub, Number(page), Number(limit));
	}
}
