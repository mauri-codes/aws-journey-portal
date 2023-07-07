import { ErrorDescription } from "..";

export const NoRoleNameForInlinePolicy: () => ErrorDescription =
    () => ({
        code: NoRoleNameForInlinePolicy.name,
        message: `A Role Name is needed to query an Inline Policy`
    })
export const NoPolicyNameForInlinePolicy: () => ErrorDescription =
    () => ({
        code: NoPolicyNameForInlinePolicy.name,
        message: `A Policy Name is needed to query an Inline Policy`
    })


