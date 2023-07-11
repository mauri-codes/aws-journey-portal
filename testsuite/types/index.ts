import { Resource } from "../resources"

// npx tsc
export interface EnvironmentConfig {
    roleArn: string
    targetAccountId?: string
    region?: string
    secRegion?: string
}
export interface AWSCredentialsConfig {
    region?: string
    credentials?: {
        secretAccessKey: string
        accessKeyId: string
        sessionToken?: string
    }
}
export type ObjectMap = {[key: string]: any}
export type ResourceMap = {[key: string]: Resource}

export interface Tag {
    Name: string
    Value: string
}
export type AWSClient = "iam" | "lambda" | "sts" | "ec2" | "s3"
export type AWSClientsObject = {[key in AWSClient]: any};
