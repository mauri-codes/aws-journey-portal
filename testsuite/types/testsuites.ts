import { AWSEnvironment } from "../resources"
import { TestResult } from "./tests"

export interface TestSuiteReport {
    testSuiteCode: string
    tests: TestResult[]
}
export interface EnvironmentCollection {
    [key: string]: AWSEnvironment
}
