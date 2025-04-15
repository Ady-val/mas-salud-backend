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
import { IUserTokenInfo } from 'common/formats/user-token-info.interface';

export type Subjects = InferSubjects<typeof User> | Modules | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: IUserTokenInfo): AppAbility {
    const { can, build } = new AbilityBuilder<PureAbility<[Action, Subjects]>>(
      PureAbility as AbilityClass<AppAbility>,
    );

    can(Action.Read, Modules.Dashboard);

    if (user.role?.includes(Role.ADMIN) || user.isAdmin) {
      can(Action.Manage, 'all');
    }

    if (user.role?.includes(Role.DATA_ENTRY_OPERATOR)) {
      can(Action.Read, Modules.Institutions);
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
      can(Action.Read, Modules.InventoryItem);
      can(Action.Create, Modules.InventoryItem);
      can(Action.Update, Modules.InventoryItem);
      can(Action.Delete, Modules.InventoryItem);
      can(Action.Read, Modules.InventoryMovement);
      can(Action.Create, Modules.InventoryMovement);
      can(Action.Update, Modules.InventoryMovement);
      can(Action.Delete, Modules.InventoryMovement);
      can(Action.Read, Modules.MedicalSpecialists);
      can(Action.Create, Modules.MedicalSpecialists);
      can(Action.Update, Modules.MedicalSpecialists);
      can(Action.Delete, Modules.MedicalSpecialists);
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  getRulesForUser(user: IUserTokenInfo): AppAbility['rules'] {
    const ability = this.createForUser(user);
    return ability.rules;
  }
}
