export interface TestResult {
    testCode?: string
    success: boolean
    message?: string
    results?: any
    tests?: TestResult[]
    errorCode?: string
    type?: string
}
