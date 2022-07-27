import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly userRepostory: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepostory.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepostory.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      'Generated JWT Token with payload ' + JSON.stringify(payload),
    );

    return { accessToken };
  }
}
