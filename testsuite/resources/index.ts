import { EnvironmentConfig, AWSClientsObject, AWSCredentialsConfig, AWSClient } from "../types"
import { STSClient, AssumeRoleCommand, STSClientConfig, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { EC2Client, EC2ClientConfig } from "@aws-sdk/client-ec2";
import { IAMClient, IAMClientConfig } from "@aws-sdk/client-iam";
import { TestResult } from "../types/tests";


export class AWSEnvironment {
    environment: EnvironmentConfig
    awsClients?: AWSClientsObject
    awsConfig?: AWSCredentialsConfig
    envLoaded: boolean
    sts: STSClient
    constructor(environment: EnvironmentConfig) {
        this.envLoaded = false
        this.environment = environment
        this.sts = new STSClient({region: "us-east-1"})
    }
    async initialize() {
        if (!this.envLoaded) {
            let assumeRoleResponse = await this.sts.send(new AssumeRoleCommand({
                RoleArn: this.environment.roleArn,
                RoleSessionName: "AWS_JOURNEY",
                DurationSeconds: 3600,
              }))
              
            this.awsConfig = {
                credentials: {
                    accessKeyId: assumeRoleResponse.Credentials?.AccessKeyId || "",
                    secretAccessKey: assumeRoleResponse.Credentials?.SecretAccessKey || "",
                    sessionToken: assumeRoleResponse.Credentials?.SessionToken
                },
                region: this.environment.region
            }
            await this.getAccountNumber()
            this.awsClients = {
                "iam": (region?: string) => new IAMClient(this.client(this.awsConfig, region) as IAMClientConfig),
                "lambda": "",
                "sts": (region?: string) => new STSClient(this.client(this.awsConfig, region) as STSClientConfig),
                "ec2": (region?: string) => new EC2Client(this.client(this.awsConfig, region) as EC2ClientConfig)
            }
            this.envLoaded = true
        }
    }
    client(config: AWSCredentialsConfig|undefined, region?: string) {
        if (region)
            return {...config, region}
        return config
    }
    getAWSClient(client: AWSClient) {
        if (this.awsClients)
            return this.awsClients[client]()
        return undefined
    }
    async getAccountNumber() {
        if (this.environment.targetAccountId === undefined) {
            const requestOutput = await this.sts.send(new GetCallerIdentityCommand({}))
            this.environment.targetAccountId = requestOutput.Account || undefined
        }
        return this.environment.targetAccountId
    }
}

export abstract class Resource {
    environment: AWSEnvironment
    loadOutput: TestResult | undefined
    abstract resourceName: string
    constructor(environment: AWSEnvironment) {
        this.environment = environment
    }
    async load() {
        await this.environment.initialize()
        await this.loadClients(this.environment)
        const loadOutput = await this.loadResource()
        this.loadOutput = loadOutput
        return loadOutput
    }
    abstract loadClients(environment: AWSEnvironment):void
    abstract loadResource():Promise<TestResult>
}

export type ResourceCollection = {[key:string]: Resource}
