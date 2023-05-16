// npx tsc
export interface EnvironmentConfig {
    accountId: string
    roleArn: string
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
type AWSClient = "iam" | "lambda" | "sts" | "ec2"
export type AWSClientsObject = {[key in AWSClient]: any};
