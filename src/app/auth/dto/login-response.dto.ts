import { AppAbility } from '../casl/casl-ability.factory';

export class LoginResponseDto {
  accessToken: string;
  username: string;
  institution: string;
  name: string;
  rules: AppAbility['rules'];
}
