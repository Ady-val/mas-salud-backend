import { Expose } from 'class-transformer';

export class CreateTokenDto {
  @Expose()
  accessToken: string;

  @Expose()
  expiresIn: string;
}
