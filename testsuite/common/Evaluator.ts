import { ObjectMap } from "../types"
import { EvaluatorErrorData, EvaluatorReponse } from "../types/evaluator"

export class Evaluator {
    static evaluateArrayOfObjects(expectations:ObjectMap[], baseArray: ObjectMap[], path?: string) {
        let response = this.getResponse(true)
        for (const expObj of expectations) {
            let partialResponse = this.getResponse(true)
            let equalsFound = false
            for (const baseObj of baseArray) {
                partialResponse = this.evaluateObjects(expObj, baseObj)
                if (partialResponse.success) {
                    equalsFound = true
                    break
                }
            }
            if (!equalsFound) {
                response = this.getResponse(false, {
                    errorType: "object",
                    parameter: path,
                    object: JSON.stringify(expObj)
                })
                break
            }
        }
        return response
    }
    static evaluateAllArraysOfPrimitivesInObject(expectations: ObjectMap, baseObj: ObjectMap) {
        let response = this.getResponse(true)
        let expectationsKeys = Object.keys(expectations)
        for (const expKey of expectationsKeys) {
            let expValue = expectations[expKey]
            let baseValue = baseObj[expKey]
            if (this.isNonEmptyArrayOfPrimitives(expValue)) {
                for (const expItem of expValue) {                    
                    if (!baseValue.includes(expItem)) {
                        response = this.getResponse(false, {
                            errorType: "array",
                            parameter: expKey,
                            expected: expItem,
                            provided: JSON.stringify(baseValue)
                        })
                        break
                    }
                }
            }
            if (!response.success) break
        }
        return response
    }

    static evaluateObjects(expectations:ObjectMap, baseObject: ObjectMap) {
        let response
        response = this.evaluateAllPrimitivesInObject(expectations, baseObject)
        if(!response.success) return response
        response = this.evaluateAllArraysOfPrimitivesInObject(expectations, baseObject)
        if(!response.success) return response
        response = this.evaluateAllArraysOfObjects(expectations, baseObject)
        return response
    }
    static evaluateAllArraysOfObjects(expectations: ObjectMap, baseObject: ObjectMap) {
        let response = this.getResponse(true)
        let expectationsKeys = Object.keys(expectations)
        for (const expKey of expectationsKeys) {
            let expValue = expectations[expKey]
            let baseValue = baseObject[expKey]
            if (this.isNonEmptyArrayOfObjects(expValue)) {
                response = this.evaluateArrayOfObjects(expValue, baseValue, expKey)
                if (!response.success) break
            }
        }
        return response

    }
    static evaluateAllPrimitivesInObject(expectations: ObjectMap, baseObject: ObjectMap) {
        let response = this.getResponse(true)
        let expectationsKeys = Object.keys(expectations)
        for (const expKey of expectationsKeys) {
            let expValue = expectations[expKey]
            let baseValue = baseObject[expKey]
            if (typeof expValue !== "object" && expValue != baseValue) {
                response = this.getResponse(false, {
                    errorType: "value",
                    parameter: expKey,
                    provided: baseObject[expKey],
                    expected: expectations[expKey]
                })
                break
            }
        }
        return response
    }
    static getResponse(success: boolean, data?: EvaluatorErrorData): EvaluatorReponse {
        return {
            success, data
        }
    }
    static isNonEmptyArrayOfPrimitives(element: any) {
        return Array.isArray(element) && element.length !== 0 && typeof element[0] !== "object"
    }
    static isNonEmptyArrayOfObjects(element:any) {
        return Array.isArray(element) && element.length !== 0 && typeof element[0] === "object" && element[0] != null
    }
}