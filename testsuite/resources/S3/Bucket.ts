import { S3Resource } from ".";
import { TestError } from "../../errors";
import { CatchTestError, SuccessfulLoad } from "../../tests";
import { ListBucketsCommand, Bucket as S3Bucket } from "@aws-sdk/client-s3";
import { BucketConstructorParameters, BucketExpectations, BucketIdentifier } from "../../types/S3/Bucket";
import {
    S3BucketNotFound,
    NoPrefixedBucketFound,
    NoSuffixedBucketFound,
    MultiplePrefixedBuckets,
    MultipleSuffixedBuckets
} from "../../errors/S3/Bucket";
export class Bucket extends S3Resource {
    resourceName:string = Bucket.name
    bucketArn: string | undefined
    bucketIdentifier: BucketIdentifier
    bucketExpectations: BucketExpectations
    constructor({environment, bucketExpectations, bucketIdentifier}: BucketConstructorParameters) {
        super(environment)
        this.bucketIdentifier = bucketIdentifier
        this.bucketExpectations = bucketExpectations
    }
    async checkBucket () {
        const { bucketName } = this.bucketIdentifier
        const requestOutput = await this.client.send(new ListBucketsCommand({}))
        const buckets: S3Bucket[] = requestOutput.Buckets || []
        
        if (bucketName?.charAt(0) === "*") {
            let suffix = bucketName.slice(1)
            let bucketsWithSuffix = buckets.filter(bucket => bucket.Name?.endsWith(suffix))
            if (bucketsWithSuffix.length == 0) throw new TestError(NoSuffixedBucketFound(suffix))
            if (bucketsWithSuffix.length >= 2) throw new TestError(MultipleSuffixedBuckets(suffix))
            this.bucketIdentifier.bucketName = bucketsWithSuffix[0].Name
        } else if (bucketName?.slice(-1) === "*") {
            let prefix = bucketName.slice(0, -1)
            let bucketsWithPrefix = buckets.filter(bucket => bucket.Name?.startsWith(prefix))
            if (bucketsWithPrefix.length == 0) throw new TestError(MultiplePrefixedBuckets(prefix))
            if (bucketsWithPrefix.length >= 2) throw new TestError(NoPrefixedBucketFound(prefix))
            this.bucketIdentifier.bucketName = bucketsWithPrefix[0].Name
        } else {
            const bucketExists = buckets
                .map(bucket => bucket.Name)
                .includes(bucketName)
            if (!bucketExists) throw new TestError(S3BucketNotFound(bucketName || ""))
        }
        return this.bucketIdentifier.bucketName
    }
    @CatchTestError()
    async loadResource () {
        await this.checkBucket()
        return SuccessfulLoad(this.resourceName)
    }
}
