import { Expose } from 'class-transformer';

export class TokenPayloadDto {
  @Expose()
  username: string;

  @Expose()
  sub: string;

  @Expose()
  institutionId: string;

  @Expose()
  institution: string;

  @Expose()
  role: string[];

  @Expose()
  isAdmin: boolean;

  @Expose()
  iat: number;

  @Expose()
  exp: number;
}
