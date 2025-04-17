import { SetMetadata } from '@nestjs/common';
import { Action } from '@common/enum/action.enum';
import { Subjects } from '../casl/casl-ability.factory';

export const CHECK_ABILITY = 'check_ability';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export const Roles = (...rules: RequiredRule[]) => SetMetadata(CHECK_ABILITY, rules);
