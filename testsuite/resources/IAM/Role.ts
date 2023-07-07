import { IAMResource } from ".";
import { CustomerManagedPolicy } from "./Policy";
import { CatchTestError, SuccessfulLoad } from "../../tests";
import { RoleConstructorParameters, RoleExpectation } from "../../types/IAM/Role";
import {
    GetRoleCommand,
    AttachedPolicy,
    Role as RoleData,
    ListRolePoliciesCommand,
    ListAttachedRolePoliciesCommand
} from "@aws-sdk/client-iam";

export class Role extends IAMResource {
    resourceName: string = Role.name
    roleName: string
    roleExpectations: RoleExpectation | undefined
    roleData: RoleData | undefined
    managedPoliciesList: AttachedPolicy[] | undefined
    managedPolicies: CustomerManagedPolicy[] | undefined
    inlinePolicies: string[] | undefined
    constructor({environment, roleExpectations, roleIdentifier}: RoleConstructorParameters) {
        super(environment)
        this.roleExpectations = roleExpectations
        this.roleName = roleIdentifier?.roleName || ""
    }
    async getRoledData() {
        const params = {RoleName: this.roleName}
        const requestOutput = await this.client.send(new GetRoleCommand(params))
        this.roleData = requestOutput.Role
        
        return this.roleData
    }
    async getManagedPoliciesList() {
        const params = {RoleName: this.roleName}
        const requestOutput = await this.client.send(new ListAttachedRolePoliciesCommand(params))
        console.log(requestOutput);
        
        this.managedPoliciesList = requestOutput.AttachedPolicies
        return this.managedPoliciesList
    }
    async loadExpectationsManagedPolicies() {
        if(this.roleExpectations?.CustomerManagedPolicies) {
            const policiesRequests = this.roleExpectations.CustomerManagedPolicies.map((policy) => policy.load())
            await Promise.all(policiesRequests)
            this.managedPolicies = this.roleExpectations.CustomerManagedPolicies
        }
    }
    async getInlinePolicies() {
        const params = {RoleName: this.roleName}
        const requestOutput = await this.client.send(new ListRolePoliciesCommand(params))
        this.inlinePolicies = requestOutput.PolicyNames
        return this.inlinePolicies
    } 
    @CatchTestError()
    async loadResource () {
        let requests: Promise<any>[] = []
        if (this.roleExpectations?.RoleData) {
            requests.push(this.getRoledData())
        }
        if (this.roleExpectations?.InlinePolicies) {
            requests.push(this.getInlinePolicies())
        }
        if (this.roleExpectations?.CustomerManagedPolicies) {
            requests.push(this.getManagedPoliciesList())
            requests.push(this.loadExpectationsManagedPolicies())
        }
        await Promise.all(requests)
        return SuccessfulLoad(this.resourceName)
    }
}
