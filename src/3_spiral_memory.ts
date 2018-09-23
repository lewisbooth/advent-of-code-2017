import test from "./test"

const INPUT = 265149

// STAGE 1
// A grid of cells is allocated in a counter-clockwise spiral pattern starting at [0x, 0y].
// The value of each cell increments by 1 from the previous cell, starting from 1. 
// Calculate the 'Manhattan Distance' of a given number's location back to the center.

// 17  16  15  14  13
// 18   5   4   3  12
// 19   6   1   2  11
// 20   7   8   9  10
// 21  22  23---> ...

// This algorithm avoids looping through individual cells to calculate their positions/values.
// Instead, it quickly calculates which loop contains the target number, giving the X distance.
// The Y distance is found using the length of the target loop.

// Because of this, the algorithm is fast and uses almost no memory.
// It solves for '265,149' over 150,000x per second at roughly O(1 + 0.005N).
// Solving for '265,149' is only ~10x slower than '100'.

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
    // Y position of loop start number (drops by 1 for each loop, starting on 2nd loop)
    const loopStartNumberYOffset = -(loop - 1)
    // Difference between loop start number and target
    const loopTargetOffset = target - loopStartNumber
    // Y offset from loop start number to target
    const loopTargetYOffset = loopTargetOffset % loopSideLength
    // Y offset from target to line 0 (this can be negative, Math.abs() ensures a positive value)
    const targetYOffset =  Math.abs(loopStartNumberYOffset + loopTargetYOffset)
    // Add X and Y distances to get total Manhattan Distance    
    return targetYOffset + loop
}

console.log("//---- STAGE 1 ----//")
test(stageOne, 1, 0)
test(stageOne, 2, 1)
test(stageOne, 10, 3)
test(stageOne, 25, 4)
test(stageOne, 26, 5)
test(stageOne, INPUT, 438)


// STAGE 2
// A similar spiral grid pattern is allocated as Stage 1.
// Each cell's value is equal to the sum of all adjacent cells including diagonals. 
// Find the first value that is larger than the puzzle input.

// 147  142  133  122   59
// 304    5    4    2   57
// 330   10    1    1   54
// 351   11   23   25   26
// 362  747  806--->   ...

// For this stage we need a completely different method of generating the grid.
// This method needs to keep track of all values and positions to calculate the next cell.

const stageTwo = (target:number): number => {
    if (target <= 1) return 2
    return 1
} 

console.log("//---- STAGE 2 ----//")
test(stageTwo, 1, 2)
test(stageTwo, 4, 5)
test(stageTwo, 10, 11)