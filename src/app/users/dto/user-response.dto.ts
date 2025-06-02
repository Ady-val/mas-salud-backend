import { Exclude, Expose, Type } from 'class-transformer';

export class UserProfile {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  name: string;

  @Expose()
  role: string;

  @Expose()
  roleId: string;

  @Expose()
  institution: string | null;

  @Expose()
  institutionId: string;

  @Expose()
  isAdmin: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  deletedAt: Date | null;

  @Exclude()
  userRoles: any[];
}

export class UsersResponse {
  @Expose()
  count: number;

  @Expose()
  page: number;

  @Expose()
  totalPages: number;

  @Expose()
  limit: number;

  @Expose()
  @Type(() => UserProfile)
  data: UserProfile[];
}
