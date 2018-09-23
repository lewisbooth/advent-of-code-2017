import test from "./test"

const input = 265149

// STAGE 1
// A grid of cells is allocated in a spiral pattern starting at [0x, 0y], spiralling counter-clockwise from [1x, 0y]. The value of each cell increments by 1 from the previous cell, starting from 1. Calculate the 'Manhattan Distance' of a given number's location back to the center.

// 17  16  15  14  13
// 18   5   4   3  12
// 19   6   1   2  11
// 20   7   8   9  10
// 21  22  23---> ...

// This algorithm avoids looping through every cell to store their positions/values, so it uses almost no memory.
// Instead, it calculates which loop contains the target number (giving the X distance) then calculates the Y distance using the length of the target loop.
// With a target of '265149' it runs > 150,000x per second.
// Input '265149' is only 10x slower than '100'
const stageOne = (target: number): number => {
    if (target <= 1) return 0
    // Calculate the X distance to the loop containing the target number
    let loop = 0
    let total = 1
    while (total < target) {
        // Spiral length increases by 8 for each loop, so we can skip by this amount each time
        total += (loop + 1) * 8
        loop ++
    }
    // Length of the target loop
    const loopLength = loop * 8
    const loopSideLength = loopLength / 4
    // First number in the target loop
    const loopStartNumber = total - loopLength + 1
    // Y position of loop start number (drops by 1 for each loop)
    const loopStartNumberYOffset = -(loop - 1)
    // Difference between loop start number and target
    const loopTargetOffset = target - loopStartNumber
    // Y offset from loop start number to target
    const loopTargetYOffset = loopTargetOffset % loopSideLength
    // Y distance from target to line 0
    const targetYOffset =  Math.abs(loopStartNumberYOffset + loopTargetYOffset)
    // Add the loop number (X distance) to get totalManhattan distance    
    return targetYOffset + loop
}

console.log("//---- STAGE 1 ----//")
test(stageOne, 1, 0)
test(stageOne, 2, 1)
test(stageOne, 10, 3)
test(stageOne, 25, 4)
test(stageOne, 26, 5)
test(stageOne, input, 438)



// STAGE 2
// A similar spiral grid pattern is allocated as Stage 1, however each cell's value is equal to the sum of all adjacent cells including diagonals. Find the first value that is larger than the puzzle input.

const stageTwo = (target:number): number => {
    if (target <= 1) return 2
    return 1
} 

console.log("//---- STAGE 2 ----//")
test(stageTwo, 1, 2)
test(stageTwo, 4, 5)
test(stageTwo, 10, 11)