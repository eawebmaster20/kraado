import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { InjectMetric, makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Controller('health')
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private db: TypeOrmHealthIndicator,
		@InjectMetric('http_requests_total') private counter: Counter<string>,
	) {}

	@Get()
	@HealthCheck()
	check() {
		return this.health.check([
			() => this.db.pingCheck('database'),
		]);
	}

	@Get('metrics')
	metrics() {
		this.counter.inc();
		return { message: 'Metrics endpoint hit' };
	}
}
