import { AppAbility } from '../casl/casl-ability.factory';

export class LoginResponseDto {
  accessToken: string;
  username: string;
  institutionId: string;
  name: string;
  rules: AppAbility['rules'];
}
