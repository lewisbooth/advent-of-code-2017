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

// This algorithm avoids generating the grid cell by cell in memory.
// Instead, it quickly calculates which loop contains the target number, giving the X distance.
// The Y distance is found using the length of the target loop's edges.

// Because of this, the algorithm is fast - roughly O(1.005N) - and uses almost no memory.
// Solving for '265,149' is only ~10x slower than solving for '100'.

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
    // Y offset from loop start number to target
    const loopTargetYOffset = (target - loopStartNumber) % loopSideLength
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

// For this stage we need a completely different approach to generating the grid.
// We use a 2D object to store the grid because it supports negative keys (i.e 'grid[-1][2]')

const stageTwo = (target:number): number => {
    // Initialise the grid with the first value of 1 at [0][0]
    const grid: any = {
        // X layer
        0: {
            // Y layer
            0: 1
        }
    }
    let x = 1
    let y = 0
    let currentValue = 1
    let currentLoop = 1
    // The following 4 values are used to calculate the next step in the spiral
    let loopLength = currentLoop * 8
    let loopEdgeLength = loopLength / 4
    let loopPosition = 1
    let direction = 0
    // Loop upwards until target is exceeded
    while (currentValue <= target) {
        // Calculate the sum of neighbouring cells
        let newValue = sumNeighbours(x, y, grid)
        currentValue = newValue
        // Early return if target is hit (gotta save them nanoseconds)
        if (currentValue > target) break
        // Make sure x layer of grid exists
        if (!grid[x]) {
            grid[x] = {}
        }
        // Save the sum to the grid
        grid[x][y] = newValue
        // Calculate direction towards next cell (0 = up, 1 = left etc.)
        direction = Math.floor(loopPosition / loopEdgeLength)
        // Increment grid position based on direction
        if (direction === 0) 
            y++
        else if (direction === 1) 
            x--
        else if (direction === 2) 
            y--
        else 
            x++            
        // Increment/reset position counter at the end of each loop
        if (loopPosition < loopLength) {
            loopPosition++
        } else {
            loopPosition = 1
        }
        // When the loop is finished, increment the loop counters and reset the direction
        if (direction === 4) {
            currentLoop++
            loopLength = currentLoop * 8
            loopEdgeLength = loopLength / 4
            direction = 1
        }
    }
    return currentValue
}

// Returns sum of values surrounding the target grid position
function sumNeighbours(x: number, y: number, grid: any): number {
    let value = 0
    if (grid[x]) {
        // Using '|| 0' returns 0 if the object value is undefined
        value += grid[x][y + 1] || 0
        value += grid[x][y - 1] || 0
    }
    if (grid[x + 1]) {
        value += grid[x + 1][y] || 0
        value += grid[x + 1][y + 1] || 0
        value += grid[x + 1][y - 1] || 0
    }
    if (grid[x - 1]) {
        value += grid[x - 1][y] || 0
        value += grid[x - 1][y + 1] || 0
        value += grid[x - 1][y - 1] || 0
    }
    return value
}

console.log("//---- STAGE 2 ----//")
test(stageTwo, 1, 2)
test(stageTwo, 4, 5)
test(stageTwo, 23, 25)
test(stageTwo, 747, 806)
test(stageTwo, INPUT, 266330)