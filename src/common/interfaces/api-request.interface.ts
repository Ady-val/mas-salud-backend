import { IUserTokenInfo } from 'common/formats/user-token-info.interface';
import { Request } from 'express';

export interface UserRequest extends Request {
  user: IUserTokenInfo;
}
