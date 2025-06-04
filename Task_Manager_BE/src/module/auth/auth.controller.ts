import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from './auth.jwt-auth.guard';
import { AuthService } from './auth.service';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { signInDto } from './dto/signin.dto';
import { UsersService } from '../users/users.service';
import { createUserDTO } from '../users/dto/create.dto';
import jsonResponse from 'src/utils/json_response';
@Controller()
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UsersService,
	) {}

	@ApiBody({ type: signInDto })
	@Post('login')
	async login(@Body() body: signInDto) {
		return this.authService.login(body);
	}

	@Post('register')
	@ApiBody({ type: createUserDTO })
	async register(@Body() body: createUserDTO) {
		const { jwt } = await this.userService.create(body);
		return jsonResponse(jwt, 'Register success', 200);
	}

	@Get('/me')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	async getMyInfo(@Request() req) {
		const user = await this.userService.findOne(req.user.id);
		delete user.password;
		return user;
	}
}
