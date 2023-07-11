import { IAMResource } from ".";
import { CustomerManagedPolicy } from "./Policy";
import { CatchTestError } from "../../tests";
import { RoleConstructorParameters, RoleExpectation } from "../../types/IAM/Role";
import {
    GetRoleCommand,
    AttachedPolicy,
    Role as RoleData,
    ListRolePoliciesCommand,
    ListAttachedRolePoliciesCommand
} from "@aws-sdk/client-iam";
import { ResourceDataLoadedSuccessfully, ResourceLoadedSuccessfully } from "../../errors";
import { TestResult } from "../../types/tests";

export class Role extends IAMResource {
    resourceName: string = Role.name
    roleName: string
    roleExpectations: RoleExpectation | undefined
    roleData: RoleData | undefined
    managedPoliciesList: AttachedPolicy[] | undefined
    managedPolicies: CustomerManagedPolicy[] | undefined
    inlinePolicies: string[] | undefined
    AWSManagedPolicies: AttachedPolicy[] = []
    CustomerManagedPolicies: AttachedPolicy[] = []
    constructor({environment, roleExpectations, roleIdentifier}: RoleConstructorParameters) {
        super(environment)
        this.roleExpectations = roleExpectations
        this.roleName = roleIdentifier?.roleName || ""
    }
    async getRoledData() {
        const params = {RoleName: this.roleName}
        const requestOutput = await this.client.send(new GetRoleCommand(params))
        this.roleData = requestOutput.Role
        if (this.roleExpectations?.CustomerManagedPolicies || this.roleExpectations?.AWSManagedPolicies) {
            await this.getManagedPoliciesList()
        }
        await this.getInlinePolicies()
        return ResourceDataLoadedSuccessfully(this.roleName, this.resourceName)
    }
    async getManagedPoliciesList() {
        const params = {RoleName: this.roleName}
        const requestOutput = await this.client.send(new ListAttachedRolePoliciesCommand(params))
        
        this.managedPoliciesList = requestOutput.AttachedPolicies
        this.AWSManagedPolicies = this.managedPoliciesList?.filter(policy => policy.PolicyArn?.startsWith("arn:aws:iam::aws:policy/")) || []
        this.CustomerManagedPolicies = this.managedPoliciesList?.filter(policy => !policy.PolicyArn?.startsWith("arn:aws:iam::aws:policy/")) || []
        return this.managedPoliciesList
    }
    async loadExpectationsManagedPolicies(): Promise<TestResult> {
        let policyResponses: TestResult[] = []
        if(this.roleExpectations?.CustomerManagedPolicies) {
            const policiesRequests = this.roleExpectations.CustomerManagedPolicies.map((policy) => policy.load())
            policyResponses = await Promise.all(policiesRequests)
            this.managedPolicies = this.roleExpectations.CustomerManagedPolicies
        }
        return {
            success: true,
            tests: policyResponses
        }
    }
    async loadExpectationsInlinePolicies(): Promise<TestResult> {
        let policyResponses: TestResult[] = []
        if (this.roleExpectations?.InlinePolicies) {
            this.roleExpectations?.InlinePolicies?.forEach(policy => policy.roleName = this.roleName)
            const policyRequests = this.roleExpectations?.InlinePolicies?.map(policy => policy.load())
            policyResponses = await Promise.all(policyRequests)
        }
        return {
            success: true,
            tests: policyResponses
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
        let requests: Promise<TestResult>[] = []
        requests.push(this.getRoledData())
        if (this.roleExpectations?.CustomerManagedPolicies) {
            requests.push(this.loadExpectationsManagedPolicies())
        }
        if (this.roleExpectations?.InlinePolicies) {
            requests.push(this.loadExpectationsInlinePolicies())
        }
        const responses = await Promise.all(requests)
        return ResourceLoadedSuccessfully(this.roleName, this.resourceName, this.flattenTestResults(responses))
    }
}
