import { AbilityBuilder, createMongoAbility, InferSubjects, MongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '@common/entities/users.entity';
import { Action } from '@common/enum/action.enum';
import { Modules } from '@common/enum/modules.enum';
import { IUserTokenInfo } from '@common/formats/user-token-info.interface';
import { RolesService } from '@app/roles/roles.service';

export type Subjects = InferSubjects<typeof User> | Modules | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly rolesService: RolesService) {}

  async createForUser(user: IUserTokenInfo): Promise<MongoAbility> {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    const { permissions } = await this.rolesService.getRoleByUserId(user.sub);

    permissions.forEach(({ module: mod, actions, isGlobal }) => {
      can(actions, mod, { isGlobal });
    });

    try {
      return build();
    } catch (error) {
      console.error('Error building ability:', error);
      throw new Error('Failed to build CASL ability');
    }
  }

  async getRulesForUser(user: IUserTokenInfo): Promise<AppAbility['rules']> {
    const ability = (await this.createForUser(user)) as AppAbility;
    return ability.rules;
  }
}
