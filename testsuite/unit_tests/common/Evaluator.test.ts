import { Evaluator } from "../../common/Evaluator";

let response
describe("Evaluate all primitives in Object", () => {
    describe("Given a expectation object with only primitives", () => {
        test("Passes when given the same data in a different object", () => {
            response = Evaluator.evaluateAllPrimitivesInObject(simpleExpObject1, simpleDataObject1)
            expect(response.success).toBeTruthy()
        })
        test("Passes when given an object with more data but same in primitives", () => {
            response = Evaluator.evaluateAllPrimitivesInObject(simpleExpObject1, mixedObject1)
            expect(response.success).toBeTruthy()
        })
        test("Fails when given an object with different values", () => {
            response = Evaluator.evaluateAllPrimitivesInObject(simpleExpObject1, simpleObject2)
            expect(response.success).toBeFalsy()
        })
    })
    describe("Given a expectation object with more values than primitives", () => {
        test("Passes when given an object with only its primitive values", () => {
            response = Evaluator.evaluateAllPrimitivesInObject(mixedObject1, simpleDataObject1)
            expect(response.success).toBeTruthy()
        })
        test("Passes when given an object with more data but same in its primitives", () => {
            response = Evaluator.evaluateAllPrimitivesInObject(mixedObject1, mixedObject3)
            expect(response.success).toBeTruthy()
        })
        test("Fails when given an object with different values", () => {
            response = Evaluator.evaluateAllPrimitivesInObject(mixedObject1, simpleObject2)
            expect(response.success).toBeFalsy()
        })
    })
})

describe("Evaluate All Arrays of Primitives in Object", () => {
    describe("Given an expectation object with array parameters", () => {
        test("Passes when given an object that contains the elements in expectations", () => {
            response = Evaluator.evaluateAllArraysOfPrimitivesInObject(mixedObject1, mixedObject2)
            expect(response.success).toBeTruthy()
        })
        test("Fails when given an object that does not contain the elements in expectations", () => {
            response = Evaluator.evaluateAllArraysOfPrimitivesInObject(mixedObject1, mixedObject3)
            expect(response.success).toBeFalsy()
        })
    })
})

describe("Evaluate Array of objects", () => {
    describe("Given an expectations array of objects", () => {
        test("Passes when given an array of objects that includes the ones in expectations", () => {
            response = Evaluator.evaluateArrayOfObjects(mixedObject1.arrayObjects, mixedObject2.arrayObjects)
            expect(response.success).toBeTruthy()
        })
        test("Fails when given an array of objects that does not include the ones in expectations", () => {
            response = Evaluator.evaluateArrayOfObjects(mixedObject1.arrayObjects, mixedObject3.arrayObjects)
            expect(response.success).toBeFalsy()
        })
        test("Fails when given an array of objects having an attribute with different type", () => {
            response = Evaluator.evaluateArrayOfObjects(mixedObject1.arrayObjects, mixedObject3.arrayObjects)
            expect(response.success).toBeFalsy()
        })
    })
})

describe("Evaluate Objects", () => {
    describe("Given an object with primitives, arrays and nested objects", () => {
        test("Passes when given an object with same values as expectations", () => {
            response = Evaluator.evaluateObjects(mixedObject4, mixedObject5)
            expect(response.success).toBeTruthy()
        })
        test("Fails when given an object with different array and object values", () => {
            response = Evaluator.evaluateObjects(mixedObject4, mixedObject6)
            expect(response.success).toBeFalsy()
        })
        test("Fails when given an object missing some objects or array values", () => {
            response = Evaluator.evaluateObjects(mixedObject4, mixedObject7)
            expect(response.success).toBeFalsy()
        })
    })
})

const simpleExpObject1 = {
    A: "string1",
    B: "string2",
    C: 123,
    D: false
}
const simpleDataObject1 = {
    A: "string1",
    B: "string2",
    C: 123,
    D: false
}
const mixedObject1 = {
    A: "string1",
    B: "string2",
    C: 123,
    D: false,
    E: ["a", "d"],
    F: {
        "cat": "whiskers",
        "dog": "spikey"
    },
    K: [1, 2, 5],
    arrayObjects: [
        {
            param1: "value1",
            param2: 4
        }
    ]
}
const simpleObject2 = {
    A: "string3",
    B: "string4",
    C: 123,
    D: true
}
const mixedObject2 = {
    A: "string1",
    B: "string2",
    C: 123,
    D: false,
    E: ["a", "b", "c", "d"],
    F: {
        "cat": "whiskers",
        "dog": "spikey"
    },
    K: [1, 2, 3, 4, 5],
    arrayObjects: [
        {
            param1: "value1",
            param2: 4
        },
        {
            param1: "value2",
            param2: 5
        }
    ]
}
const mixedObject3 = {
    A: "string1",
    B: "string2",
    C: 123,
    D: false,
    E: ["b", "c", "d"],
    F: {
        "cat": "whiskers",
        "dog": "spikey"
    },
    G: "string3",
    H: "string4",
    K: [1, 2, 3, 4, 5],
    arrayObjects: [
        {
            param1: "valueX",
            param2: 4
        },
        {
            param1: "value2",
            param2: 5
        }
    ]
}

const mixedObject4 = {
    A: "value1",
    B: [
        {
            param1: "valueX",
            param2: [
                {
                    att1: "myatt",
                    att2: 123,
                    att3: [4, 2, 1],
                    att4: [
                        {
                            X: "letter",
                            Y: ["L", "M", "N"],
                            Z: 2
                        }
                    ]
                }
            ]
        }
    ],
    C: {
        param1: "valueX",
        param2: 3
    }
}

const mixedObject5 = {
    A: "value1",
    B: [
        {
            param1: "valueX",
            param2: [
                {
                    att1: "myatt",
                    att2: 123,
                    att3: [4, 2, 1, 6],
                    att4: [
                        {
                            X: "letter",
                            Y: ["L", "M", "N", "O", "P"],
                            Z: 2
                        }
                    ]
                }
            ]
        }
    ],
    C: {
        param1: "valueX",
        param2: 3
    }
}

const mixedObject6 = {
    A: "value1",
    B: [
        {
            param1: "valueX",
            param2: [
                {
                    att1: "myatt",
                    att2: 123,
                    att3: [4, 2, 1],
                    att4: [
                        {
                            X: "letter",
                            Y: ["L"],
                            Z: 2
                        }
                    ]
                }
            ]
        }
    ],
    C: {
        param1: "valueX",
        param2: 3
    }
}

const mixedObject7 = {
    A: "value1",
    B: [
        {
            param1: "valueX",
            param2: [
                {
                    att1: "myatt",
                    att2: 123,
                    att3: [4, 2, 1],
                    att4: ""
                }
            ]
        }
    ],
    C: {
        param1: "valueX",
        param2: 3
    }
}
