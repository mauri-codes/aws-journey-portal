import { Evaluator } from "../common/Evaluator"
import { ArrayOfObjectsMismatch, AttributeMismatch, TestError } from "../errors"
import { ObjectMap } from "../types"
import { TestResult } from "../types/tests"

export abstract class Test<ResourcesMap> {
    resources: ResourcesMap
    constructor(resources: ResourcesMap) {
        this.resources = resources
    }
    compareAttributes(resource: string , expectations: ObjectMap = {}, baseObject: ObjectMap={}) {
        let response: TestResult = {
            success: true,
            message: "All attributes match"
        }
        let evaluation = Evaluator.evaluateAllPrimitivesInObject(expectations, baseObject)
        if (!evaluation.success) {
            throw new TestError(AttributeMismatch(resource, evaluation.data?.parameter || "", evaluation.data?.expected, evaluation.data?.provided))
        }
        return response
    }
    compareArrayOfObjects(resource: string, expectation: ObjectMap[] = [], baseArray: ObjectMap[] = [], path?: string) {
        let response: TestResult = {
            success: true,
            message: "All attributes match"
        }
        let evaluation = Evaluator.evaluateArrayOfObjects(expectation, baseArray, path)
        if (!evaluation.success) {
            throw new TestError(ArrayOfObjectsMismatch(resource, evaluation.data?.parameter || "", evaluation.data?.object))
        }
        return response
    }
    abstract run(): Promise<TestResult>
}

export function CatchTestError() {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value
 
        descriptor.value = async function(...args: any[]): Promise<TestResult> {
            try {
                return await originalMethod.apply(this, args)
            } catch (error: any) {
                const response: TestResult = {
                    success: false,
                    message: error.message,
                    errorCode: error.code || error.Code || error?.info?.errorCode
                }
                return response
            }
        }
        return descriptor
    }
}

export const SuccessfulLoad: (resource:string) => TestResult =
    (resource) => ({
        success: true,
        message: `${resource} loaded successfully`
    })
