import { AWSEnvironment, Resource } from "..";
import { S3Client } from "@aws-sdk/client-s3";

export abstract class S3Resource extends Resource {
    client: S3Client = new S3Client({})
    constructor(environment: AWSEnvironment) {
        super(environment)
        this.loadClients(environment)
    }
    loadClients(environment: AWSEnvironment): void {
        this.client = environment.getAWSClient("s3")
    }
}
