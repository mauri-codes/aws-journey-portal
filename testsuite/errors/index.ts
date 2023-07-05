import { Resource } from "../resources"

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
