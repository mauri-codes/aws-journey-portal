import { Resource } from "../resources";
import { Test } from "../tests";
import { EnvironmentCollection, TestSuiteReport } from "../types/testsuites";


export abstract class TestSuite <ResourceCollectionObject> {
    environments: EnvironmentCollection
    resources: ResourceCollectionObject | undefined
    resourcesList: Resource[] = []
    tests: Test<any>[] = []
    constructor(environment: EnvironmentCollection) {
        this.environments = environment
    }
    abstract run(): Promise<TestSuiteReport>
}
