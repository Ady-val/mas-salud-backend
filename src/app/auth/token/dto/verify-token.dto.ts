import { Expose } from 'class-transformer';

export class VerifyTokenDto {
  @Expose()
  isValid: boolean;

  @Expose()
  message: string;
}
