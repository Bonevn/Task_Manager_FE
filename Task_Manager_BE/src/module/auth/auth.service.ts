/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.usersService.findOneByEmail(email);
		if (user && (await bcrypt.compare(password, user.password))) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user: any) {
		const userData = await this.validateUser(user.email, user.password);
		if (!userData) {
			throw new UnauthorizedException();
		} else {
			delete userData.password;
			return {
				access_token: this.jwtService.sign(userData),
			};
		}
	}
}
