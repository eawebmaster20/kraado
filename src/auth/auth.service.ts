import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type UserRole = 'provider' | 'admin';
export interface JwtPayload {
	sub: number;
	username: string;
	role: UserRole;
}

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}

	// Dummy user validation (replace with real DB lookup)
	async validateUser(token: string): Promise<JwtPayload | null> {
		try {
			return this.jwtService.verify<JwtPayload>(token);
		} catch {
			return null;
		}
	}

	sign(payload: JwtPayload): string {
		return this.jwtService.sign(payload);
	}
}
