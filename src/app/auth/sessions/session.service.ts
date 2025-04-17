import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from '../../../common/entities/sessions.entity';
import { TokenService } from '../token/token.service';
import { User } from '@common/entities/users.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly jwt: TokenService,
  ) {}

  private async findSessionByToken(token: string): Promise<SessionEntity | null> {
    return await this.sessionRepository.findOne({ where: { token } });
  }

  async createSession(user: User): Promise<SessionEntity> {
    const token = this.jwt.generateAccessToken(user);
    const session = this.sessionRepository.create({
      userId: user.id,
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    });
    return this.sessionRepository.save(session);
  }

  async checkSession(token: string): Promise<SessionEntity | null> {
    const session = await this.findSessionByToken(token);
    if (!session) return null;

    const isExpired = session.expiresAt < new Date();

    if (isExpired) {
      return null;
    }

    return session;
  }
}
