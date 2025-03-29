import { CreateUserTable1743005415664 } from './1743005415664-CreateUserTable';
import { CreateSessionsTable1743178264415 } from './1743178264415-create-sessions-table';
import { AddExpireSessionEvent1743181168172 } from './1743182825536-add-expire-session-event';
import { UpdateSessionToken1743205216362 } from './1743205216362-update-session-token';
import { AddRoleColumnUsers1743257654393 } from './1743257654393-add-role-column-users';
import { AddIsAdminColumnUsers1743258743931 } from './1743258743931-add-isAdmin-column-users';

const migrations = [
  CreateUserTable1743005415664,
  CreateSessionsTable1743178264415,
  AddExpireSessionEvent1743181168172,
  UpdateSessionToken1743205216362,
  AddRoleColumnUsers1743257654393,
  AddIsAdminColumnUsers1743258743931,
];

export { migrations };
