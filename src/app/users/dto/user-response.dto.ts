import { Exclude, Expose } from 'class-transformer';

export class UserResponse {
  @Expose()
  username: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose({ name: 'institution' })
  institutionName: string | null;

  @Exclude()
  id: string;

  @Exclude()
  institutionId: string;

  @Exclude()
  password: string;

  @Exclude()
  deletedAt: Date | null;
}
