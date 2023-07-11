import { Resource } from "../resources";
import { Test } from "../tests";
import { ObjectMap, ResourceMap } from "../types";
import { TestResult } from "../types/tests";
import { EnvironmentCollection, TestSuiteReport } from "../types/testsuites";

export abstract class TestSuite <ResourceCollectionObject> {
    environments: EnvironmentCollection
    resourcesList: Resource[] = []
    tests: Test<any>[] = []
    resources: ResourceCollectionObject | undefined
    constructor(environment: EnvironmentCollection) {
        this.environments = environment
    }
    async loadResources (): Promise<TestResult[]> {
        const resources = this.resources as ResourceMap
        const loadArray = Object.values(resources || {}).map(resource => resource.load())
        return await Promise.all(loadArray)
    }
    async runTests (tests: Test<any>[]) {
        const requests = tests.map(test => test.run())
        return await Promise.all(requests)
    }
    abstract run(): Promise<TestResult>
}
