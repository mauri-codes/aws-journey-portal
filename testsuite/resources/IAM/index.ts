import { AWSEnvironment, Resource } from "..";
import { IAMClient } from "@aws-sdk/client-iam";
import { PolicyExpectations } from "../../types/IAM/Policy";

export abstract class IAMResource extends Resource {
    client: IAMClient = new IAMClient({})
    constructor(environment: AWSEnvironment) {
        super(environment)
        this.loadClients(environment)
    }
    loadClients (environment: AWSEnvironment) {
        this.client = environment.getAWSClient("iam")
    }
}
export abstract class IAMPolicy extends IAMResource {
    policyName: string | undefined
    policyDoc: string | undefined
    policyExpectations: PolicyExpectations | undefined
}
