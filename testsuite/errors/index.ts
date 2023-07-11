import { Resource } from "../resources"
import { TestResult } from "../types/tests"

export interface ErrorDescription {
    message: string
    code: string
}

export class TestError extends Error {
    info: ErrorDescription
    code: string
    constructor(error: ErrorDescription) {
       super(error.message)
       this.info = error
       this.code = error.code
    }
}

export const AttributeMismatch: (resource: string, attribute: string, expected: any, found: any) => ErrorDescription =
    (resource, attribute, expected, found) => ({
        code: AttributeMismatch.name,
        message: `${resource} expected attribute ${attribute} to be ${expected}. Found ${found}`
    })

export const ArrayOfObjectsMismatch: (resource: string, attribute: string, expected: any) => ErrorDescription =
    (resource, attribute, expected) => ({
        code: ArrayOfObjectsMismatch.name,
        message: `${resource} expected attribute ${attribute} does not include object: ${JSON.stringify(expected)}`
    })

export const ResourceDidNotLoad: (resource: Resource) => ErrorDescription =
    (resource) => ({
        code: ResourceDidNotLoad.name,
        message: `${resource.resourceName} Resource did not load`
    })

export const ResourceLoadError: (resource: Resource) => ErrorDescription =
    (resource) => ({
        code: ResourceLoadError.name,
        message: `${resource.resourceName} resource load error: ${resource.loadOutput?.message}`
    })
export const ResourceLoadedSuccessfully: (resourceName: string, resource: string, tests?: TestResult[]) => TestResult =
    (resource, resourceName, tests?) => ({
        success: true,
        code: ResourceLoadedSuccessfully.name,
        message: `${resourceName} ${resource} loaded successfully`,
        tests
    })
export const ResourceDataLoadedSuccessfully: (resourceName: string, resource: string) => TestResult =
    (resource, resourceName) => ({
        success: true,
        code: ResourceDataLoadedSuccessfully.name,
        message: `${resourceName} ${resource} data loaded successfully`
    })
