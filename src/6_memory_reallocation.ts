import test from "./test"

const INPUT = [2,8,8,5,4,2,3,1,5,5,1,2,15,13,5,14]

// STAGE 1
// There are sixteen memory banks; each memory bank can hold any number of blocks. 
// The goal of the reallocation routine is to balance the blocks between the memory banks.

// The reallocation routine operates in cycles. In each cycle, it finds the memory bank 
// with the most blocks (ties won by the lowest-numbered memory bank) and redistributes 
// those blocks among the banks. To do this, it removes all of the blocks from the 
// selected bank, then moves to the next (by index) memory bank and inserts one of the 
// blocks. It continues doing this until it runs out of blocks.

// How many redistributions can be done before a blocks-in-banks configuration is produced 
// that has been seen before?

function stageOne(input: number[]): number {
    // Copy array in memory (pure function)
    let currentState = [...input]
    // Store previous states
    let history = []
    // Cycle memory bank until a previous state is duplicated
    while (!matches(history, currentState)) {
        history.push(currentState)
        currentState = cycle(currentState)
    }
    return history.length
}

// Take highest numbered slot and reallocate it amongst other slots
function cycle(input: number[]) {
    let bank = [...input]
    const max = Math.max(...bank)
    let position = bank.indexOf(max)
    // Set highest number to 0
    bank[position] = 0
    // Spread highest number across subsequent slots
    for (let i = 0; i < max; i++) {
        position++
        // Loop around to start of array
        if (position === bank.length) {
            position = 0
        }
        bank[position] += 1
    }
    return bank
}

// Check if the current bank array matches any previous states
function matches(history: number[][], bank: number[]): boolean {
    const matches = history.filter(array => {
        const numberMatches = array.filter((number, i) => {
            return number === bank[i]
        })
        return numberMatches.length === array.length
    })
    return matches.length > 0
}

test(stageOne, [0,2,7,0], 5)
test(stageOne, INPUT, 3156)


// STAGE 2
// Continue redistributing slots starting from the first matching state found in Stage 1.
// How many cycles does it take to create an infinite loop from the Stage 1 result?

function stageTwo(input: number[]): number {
    // Use the same code as Stage 1
    let currentState = [...input]
    let history = []
    while (!matches(history, currentState)) {
        history.push(currentState)
        currentState = cycle(currentState)
    }
    // When we find the first match, reset the history and repeat
    history = []    
    while (!matches(history, currentState)) {
        history.push(currentState)
        currentState = cycle(currentState)
    }
    return history.length
}

test(stageTwo, INPUT, 1610)