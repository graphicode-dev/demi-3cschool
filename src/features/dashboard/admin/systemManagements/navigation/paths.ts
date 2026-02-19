import { groupsPaths } from "../pages/groups/navigation";
import { squadsPaths } from "../pages/squads/navigation";
import { permissionPaths } from "../pages/permissions/navigation";
import { rolesPaths } from "../pages/roles/navigation";
import { usersPaths } from "../pages/users/navigation";

export const managementPaths = {
    permissionPaths,
    usersPaths,
    rolesPaths,
    groupsPaths,
    squadsPaths,
} as const;
