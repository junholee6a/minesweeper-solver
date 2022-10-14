import {certainFlags} from "./script.js"

function testCertainFlags() {
    tests = [
        {
        frame: [[1, -1],
                [1, 1]],
        numR: 0,
        numC: 0
        }
    ];

    for (test of tests) {
        console.log(certainFlags(test.frame, test.numR, test.numC));
    }
}

testCertainFlags();