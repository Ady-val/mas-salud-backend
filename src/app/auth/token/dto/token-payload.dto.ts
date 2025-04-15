import { Expose } from 'class-transformer';

export class TokenPayloadDto {
  @Expose()
  username: string;

  @Expose()
  sub: string;

  @Expose()
  institution: string;

  @Expose()
  iat: number;

  @Expose()
  exp: number;
}
