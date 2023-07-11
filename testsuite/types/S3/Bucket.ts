import { AWSEnvironment } from "../../resources"

export interface BucketExpectations {
    PublicAccessBlockEnabled?: boolean
}

export interface BucketIdentifier {
    bucketName?: string
}

export interface BucketConstructorParameters {
    environment: AWSEnvironment
    bucketExpectations?: BucketExpectations,
    bucketIdentifier: BucketIdentifier
}
