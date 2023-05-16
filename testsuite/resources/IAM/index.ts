import { IAMClient } from "@aws-sdk/client-iam";
import { AWSEnvironment, Resource } from "..";

export abstract class IAMResource extends Resource {
    client: IAMClient
    constructor(environment: AWSEnvironment) {
        super(environment)
        this.client = environment.getAWSClient("iam")
    }
}
