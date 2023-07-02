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

