import { Evaluator } from "../common/Evaluator"
import { ObjectMap } from "../types"
import { TestResult } from "../types/tests"
import { ArrayOfObjectsMismatch, AttributeMismatch, ResourceDidNotLoad, ResourceLoadError, TestError } from "../errors"

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
    checkLoadOutput (): TestResult {
        let resourcesArray = Object.values(this.resources as ObjectMap)
        resourcesArray.forEach(resource => {
            if (resource.loadOutput === undefined) {
                throw new TestError(ResourceDidNotLoad(resource))
            }
            if (!resource.loadOutput.success) {
                throw new TestError(ResourceLoadError(resource))
            }
        })
        return SuccessfulLoad()
    }
    async run(): Promise<TestResult> {
        await this.checkLoadOutput()
        return await this.runTest()
    }
    abstract runTest(): Promise<TestResult>
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

export const SuccessfulLoad: (resource?:string, tests?:TestResult[]) => TestResult =
    (resource, tests) => ({
        success: true,
        message: `${resource + " " || ""}Loaded Successfully`,
        tests
    })
