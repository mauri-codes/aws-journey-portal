import { IAMClient } from "@aws-sdk/client-iam";
import { AWSEnvironment, Resource } from "..";

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
