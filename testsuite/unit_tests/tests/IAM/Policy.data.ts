import { AWSEnvironment } from "../../../resources"
import { ManagedPolicyExpectations, PolicyStatement } from "../../../types/IAM/Policy"

export const testPolicyData = {
    PolicyName: 'TEST_POLICY',
    PolicyId: 'ANPA6EVA56TZV7WMQOJ7P',
    Arn: 'arn:aws:iam::972073858291:policy/TEST_POLICY',
    Path: '/',
    DefaultVersionId: 'v1',
    AttachmentCount: 0,
    PermissionsBoundaryUsageCount: 0,
    IsAttachable: true,
    // CreateDate: new Date("2023-07-05T01:19:51.000Z"),
    // UpdateDate: new Date("2023-07-05T01:19:51.000Z"),
    Tags: []
}
export const testPolicyDocument = {
    Document:"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Sid%22%3A%20%22Statement1%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AListAccessPoints%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AListBucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AListAllMyBuckets%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3AGetUser%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3ACreateUser%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3ADeleteUser%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Aiam%3A%3A972073858291%3Auser%2Fadmin%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3ADeleteObject%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3AmyBucket%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3AmyBucket2%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3AmyBucket3%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D",
    VersionId: "v1",
    IsDefaultVersion: true,
    // CreateDate: new Date("2022-06-22T14:06:51.000Z")
}
export const environment = new AWSEnvironment({
    roleArn: "arn:aws:iam::<ACCOUNT>:role/AWS_JOURNEY_READ_ONLY",
    region: "us-east-1"
})
let SuccessfulPolicyData = {
    DefaultVersionId: "v1",
    Path: "/"
}
let NoArrayPolicyStatement: PolicyStatement = {
    Action: "s3:ListAccessPoints",
    Effect: "Allow",
    Resource: "*"
}
let SimpleArrayPolicyStatement: PolicyStatement = {
    Action: ["s3:ListAccessPoints"],
    Effect: "Allow",
    Resource: ["*"]
}
let FailSimpleArrayPolicyStatement: PolicyStatement = {
    Action: ["s3"],
    Effect: "Allow",
    Resource: ["*"]
}
let S3StarPolicyStatement: PolicyStatement = {
    Action: ["s3:ListAccessPoints", "s3:ListBucket", "s3:ListAllMyBuckets"],
    Effect: "Allow",
    Resource: ["*"]
}
let GoodIAMPolicyStatement: PolicyStatement = {
    Effect: "Allow",
    Action: [ "iam:GetUser", "iam:CreateUser", "iam:DeleteUser" ],
    Resource: [ "arn:aws:iam::972073858291:user/admin" ]
}
let BadIAMPolicyStatement: PolicyStatement = {
    Effect: "Allow",
    Action: [ "iam:GetUser", "s3:PutObject", "iam:DeleteUser" ], // SHOULD FAIL
    Resource: [ "arn:aws:iam::972073858291:user/admin" ]
}
let S3PolicyStatement: PolicyStatement = {
    Effect: "Allow",
    Action: [ "s3:GetObject", "s3:PutObject", "s3:DeleteObject" ],
    Resource: [
        "arn:aws:s3:::myBucket/*",
        "arn:aws:s3:::myBucket2/*",
        "arn:aws:s3:::myBucket3/*"
    ]
}
let SingleBucketPolicyStatement: PolicyStatement = {
    Effect: "Allow",
    Action: [ "s3:GetObject", "s3:PutObject", "s3:DeleteObject" ], 
    Resource: [
        "arn:aws:s3:::myBucket3/*"
    ]
}

export let noArrayStatementsExpectations: ManagedPolicyExpectations = {
    PolicyData: SuccessfulPolicyData,
    PolicyDocumentStatements: [
        NoArrayPolicyStatement
    ]
}
export let simpleStatementExpectation: ManagedPolicyExpectations = {
    PolicyData: {
        DefaultVersionId: "v2", // SHOULD FAIL
        Path: "/"
    },
    PolicyDocumentStatements: [
        SimpleArrayPolicyStatement
    ]
}
export let ActionMisspellStatementExpectation: ManagedPolicyExpectations = {
    PolicyData: {
        DefaultVersionId: "v1",
        Path: "/dd/" // SHOULD FAIL
    },
    PolicyDocumentStatements: [
        FailSimpleArrayPolicyStatement
    ]
}

export let MultipleStatementsExpectation: ManagedPolicyExpectations = {
    PolicyData: SuccessfulPolicyData,
    PolicyDocumentStatements: [
        S3StarPolicyStatement,
        GoodIAMPolicyStatement,
        S3PolicyStatement
    ]
}

export let BadMultipleStatementsExpectation: ManagedPolicyExpectations = {
    PolicyData: SuccessfulPolicyData,
    PolicyDocumentStatements: [
        S3StarPolicyStatement,
        BadIAMPolicyStatement,
        SingleBucketPolicyStatement
    ]
}

export let MultipleStatementsExpectation2: ManagedPolicyExpectations = {
    PolicyData: SuccessfulPolicyData,
    PolicyDocumentStatements: [
        S3StarPolicyStatement,
        GoodIAMPolicyStatement,
        SingleBucketPolicyStatement
    ]
}
// ##### DOCUMENT PARSED #####
// [
//     {
//       Sid: 'Statement1',
//       Effect: 'Allow',
//       Action: [ 's3:ListAccessPoints', 's3:ListBucket', 's3:ListAllMyBuckets' ],
//       Resource: [ '*' ]
//     },
//     {
//       Effect: 'Allow',
//       Action: [ 'iam:GetUser', 'iam:CreateUser', 'iam:DeleteUser' ],
//       Resource: [ 'arn:aws:iam::972073858291:user/admin' ]
//     },
//     {
//       Effect: 'Allow',
//       Action: [ 's3:GetObject', 's3:PutObject', 's3:DeleteObject' ],
//       Resource: [
//         'arn:aws:s3:::myBucket/*',
//         'arn:aws:s3:::myBucket2/*',
//         'arn:aws:s3:::myBucket3/*'
//       ]
//     }
// ]