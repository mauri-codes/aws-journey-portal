import { EnvironmentConfig, AWSClientsObject, AWSCredentialsConfig } from "../types"
import { STSClient, AssumeRoleCommand, STSClientConfig } from "@aws-sdk/client-sts";
import { EC2Client, EC2ClientConfig } from "@aws-sdk/client-ec2";
import { IAMClient, IAMClientConfig, ListRolesCommand } from "@aws-sdk/client-iam";


export class AWSEnvironment {
    environment: EnvironmentConfig
    awsClients?: AWSClientsObject
    awsConfig?: AWSCredentialsConfig
    sts: STSClient
    constructor(environment: EnvironmentConfig) {
        this.environment = environment
        this.sts = new STSClient({region: "us-east-1"})
    }
    async initialize() {
        let assumeRoleResponse = await this.sts.send(new AssumeRoleCommand({
            RoleArn: "arn:aws:iam::456233115093:role/OrganizationAccountAccessRole",
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
        this.awsClients = {
            "iam": () => new IAMClient(this.awsClients as IAMClientConfig),
            "lambda": "",
            "sts": () => new STSClient(this.awsConfig as STSClientConfig),
            "ec2": () => new EC2Client(this.awsConfig as EC2ClientConfig)
        }
    }
}