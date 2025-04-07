import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'common/entities/users.entity';
import { Action } from 'common/enum/action.enum';
import { Modules } from 'common/enum/modules.enum';
import { Role } from 'common/enum/role.enum';

export type Subjects = InferSubjects<typeof User> | Modules | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, build } = new AbilityBuilder<PureAbility<[Action, Subjects]>>(
      PureAbility as AbilityClass<AppAbility>,
    );

    if (user.role?.includes(Role.ADMIN) || user.isAdmin) {
      can(Action.Manage, 'all');
    }

    if (user.role?.includes(Role.DATA_ENTRY_OPERATOR)) {
      can(Action.Read, Modules.Beneficiaries);
      can(Action.Create, Modules.Beneficiaries);
      can(Action.Update, Modules.Beneficiaries);
      can(Action.Delete, Modules.Beneficiaries);
      can(Action.Read, Modules.MedicalSpecialists);
      can(Action.Create, Modules.MedicalSpecialists);
      can(Action.Update, Modules.MedicalSpecialists);
      can(Action.Delete, Modules.MedicalSpecialists);
      can(Action.Read, Modules.Products);
      can(Action.Create, Modules.Products);
      can(Action.Update, Modules.Products);
      can(Action.Delete, Modules.Products);
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
