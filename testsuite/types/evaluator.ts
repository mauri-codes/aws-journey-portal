export interface EvaluatorErrorData {
    errorType?: "value" | "object" | "array"
    parameter?: string
    expected?: string
    provided?: string
    message?: string
    object?: string
}
export interface EvaluatorReponse {
    success: boolean
    data?: EvaluatorErrorData
}
