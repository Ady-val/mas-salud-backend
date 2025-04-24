import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '@common/entities/users.entity';
import { Action } from '@common/enum/action.enum';
import { Modules } from '@common/enum/modules.enum';
import { Role } from '@common/enum/role.enum';
import { IUserTokenInfo } from '@common/formats/user-token-info.interface';

export type Subjects = InferSubjects<typeof User> | Modules | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: IUserTokenInfo): AppAbility {
    const { can, build } = new AbilityBuilder<PureAbility<[Action, Subjects]>>(
      PureAbility as AbilityClass<AppAbility>,
    );

    can(Action.Read, Modules.Dashboard);
    can(Action.Read, Modules.Institutions);

    if (user.role?.includes(Role.ADMIN) || user.isAdmin) {
      can(Action.Manage, 'all');
    }

    if (user.role?.includes(Role.DATA_ENTRY_OPERATOR)) {
      can([Action.Read, Action.Create, Action.Update, Action.Delete], Modules.Beneficiaries);
      can([Action.Read, Action.Create, Action.Update, Action.Delete], Modules.Specialist);
      can([Action.Read, Action.Create, Action.Update, Action.Delete], Modules.Products);
      can([Action.Read, Action.Create, Action.Update, Action.Delete], Modules.InventoryMovement);
      can([Action.Read, Action.Create, Action.Update, Action.Delete], Modules.InventoryItem);
    }

    if (user.role?.includes(Role.SELLER)) {
      can([Action.Read, Action.Create, Action.Update, Action.Delete], Modules.MedicationDispensing);
      can([Action.Read], Modules.Beneficiaries);
      can([Action.Read], Modules.Products);
      can([Action.Read], Modules.InventoryMovement);
      can([Action.Read], Modules.InventoryItem);
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
