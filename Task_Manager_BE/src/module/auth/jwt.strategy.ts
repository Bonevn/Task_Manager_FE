import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './auth.constants';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private prismaService: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret, // JWT Secret Key
		});
	}

	// JWT Verify User Function
	async validate(payload: any) {
		if (payload.id) {
			const user = await this.prismaService.user.findFirst({
				where: {
					id: payload.id,
				},
			});
			return {
				id: user.id,
				email: user.email,
				name: user.name,
				phoneNumber: user.phone,
				picture: user.picture,
				bio: user.bio,
			};
		}
		if (payload.keyword) {
			return {
				keyword: payload.keyword,
			};
		}
	}
}
