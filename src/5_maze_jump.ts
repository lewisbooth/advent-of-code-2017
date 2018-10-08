import test from "./test"
import INPUT from "./inputs/5_maze_jump_input"

// STAGE 1
// The input contains a list of numbers. 
// Starting at the top, use the first number as an offset to jump `n` places through the list.
// Positive numbers jump downwards, negative jumps move upwards.
// After each jump, the offset of that instruction increments by 1.
// Return the number of jumps required to break outside of the list.

// EXAMPLE
// Displayed horizontally for convenience, current position is marked with parenthesis
// (0) 3  0  1  -3  - before we have taken any steps.
// (1) 3  0  1  -3  - jump with offset 0 (that is, don't jump at all). Fortunately, the instruction is then incremented to 1.
//  2 (3) 0  1  -3  - step forward because of the instruction we just modified. The first instruction is incremented again, now to 2.
//  2  4  0  1 (-3) - jump all the way to the end; leave a 4 behind.
//  2 (4) 0  1  -2  - go back to where we just were; increment -3 to -2.
//  2  5  0  1  -2  - jump 4 steps forward, escaping the maze.

const stageOne = (input: string): number => {
    let instructionSet = input.split("\n").map(num => parseInt(num))
    let jumps = 0
    let position = 0
    while (position >= 0 && position < instructionSet.length) {
        const offset = instructionSet[position]
        instructionSet[position] += 1
        position += offset
        jumps++
    }
    return jumps - 1
}

console.log("//---- STAGE 1 ----//")
test(stageOne, "0\n3\n0\n1\n-3", 4, false)
test(stageOne, INPUT, 359348, false)


// STAGE 2
// Jumps of three or more decrease their value by 1. Otherwise, increase it by 1 as before.

const stageTwo = (input: string): number => {
    let instructionSet = input.split("\n").map(num => parseInt(num))
    let jumps = 0
    let position = 0
    while (position >= 0 && position <= instructionSet.length) {
        const offset = instructionSet[position]
        if (offset >= 3) {
            instructionSet[position] -= 1
        } else {
            instructionSet[position] += 1
        }
        position += offset
        jumps++
    }
    return jumps - 1
}

console.log("//---- STAGE 2 ----//")
test(stageTwo, "0\n3\n0\n1\n-3", 10, false)
test(stageTwo, INPUT, 27688760, false)