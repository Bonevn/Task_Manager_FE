import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from './role.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private jwtService: JwtService,
	) {}

	decodeToken(token: string) {
		try {
			return this.jwtService.decode(token);
		} catch (error) {
			return null;
		}
	}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (!requiredRoles) {
			return true;
		}
		let token = context.switchToHttp().getRequest().headers['authorization'];
		// console.log('token', token);

		if (!token) {
			return false;
		} else {
			token = token.split(' ')[1];
		}
		const user = this.decodeToken(token);
		if (user) {
			return requiredRoles.includes(user['role']);
		} else {
			return false;
		}
	}
}
