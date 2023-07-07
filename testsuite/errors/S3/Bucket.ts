import { ErrorDescription } from "..";

export const S3BucketNotFound: (bucketName: string) => ErrorDescription =
    (bucketName) => ({
        code: S3BucketNotFound.name,
        message: `${bucketName} bucket not found in account`
    })
export const MultipleSuffixedBuckets: (bucketName: string) => ErrorDescription =
    (bucketName) => ({
        code: MultipleSuffixedBuckets.name,
        message: `There is more than 1 bucket with suffix ${bucketName}`
    })
export const NoSuffixedBucketFound: (bucketName: string) => ErrorDescription =
    (bucketName) => ({
        code: NoSuffixedBucketFound.name,
        message: `There is more than 1 bucket with suffix ${bucketName}`
    })
export const MultiplePrefixedBuckets: (bucketName: string) => ErrorDescription =
    (bucketName) => ({
        code: MultiplePrefixedBuckets.name,
        message: `There is more than 1 bucket with prefix ${bucketName}`
    })
export const NoPrefixedBucketFound: (bucketName: string) => ErrorDescription =
    (bucketName) => ({
        code: NoPrefixedBucketFound.name,
        message: `There is more than 1 bucket with prefix ${bucketName}`
    })
