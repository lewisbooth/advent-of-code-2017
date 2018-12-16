import test from './test'
import INPUT from './inputs/8_cpu_registers'
import EXAMPLE_INPUT from './inputs/8_cpu_registers_example'

interface Instruction {
    register: string,
    operator: string,
    offset: string,
    condition: {
        register: string,
        comparison: string
    }
}

// STAGE 1
// Each instruction consists of several parts: the register to modify, whether to increase or
// decrease that register's value, the amount by which to increase or decrease it, and a condition. 
// If the condition fails, skip the instruction without modifying the register. The registers all 
// start at 0. The instructions look like this:

// b inc 5 if a > 1
// a inc 1 if b < 5
// c dec -10 if a >= 1
// c inc -20 if c == 10

// These instructions would be processed as follows:

//  -  Because a starts at 0, it is not greater than 1, and so b is not modified.
//  -  a is increased by 1 (to 1) because b is less than 5 (it is 0).
//  -  c is decreased by -10 (to 10) because a is now greater than or equal to 1 (it is 1).
//  -  c is increased by -20 (to -10) because c is equal to 10.

// After this process, the largest value in any register is 1.

// You might also encounter <= (less than or equal to) or != (not equal to). However, the CPU 
// doesn't have the bandwidth to tell you what all the registers are named, and leaves that to 
// you to determine.

// What is the largest value in any register after completing the instructions in your puzzle input?

function stageOne(input: string): number {
    const lines = input.split('\n')
    const registers = initRegisters(lines)
    const instructions = parseInstructions(lines)
    const processedRegisters = applyInstructions(registers, instructions)
    const max = Object.values(processedRegisters).reduce((a, b) => Math.max(a, b))
    return max
}

test(stageOne, EXAMPLE_INPUT, 1, false)
test(stageOne, INPUT, 3089, false)


// STAGE 2
// To be safe, the CPU also needs to know the highest value held in any register during this process
// so that it can decide how much memory to allocate to these operations. For example, in the above 
// instructions, the highest value ever held was 10 (in register c after the third instruction was 
// evaluated).

function stageTwo(input: string): number {
    const lines = input.split('\n')
    const registers = initRegisters(lines)
    const instructions = parseInstructions(lines)
    const maxProcessedRegister = applyInstructionsMax(registers, instructions)
    return maxProcessedRegister
}

test(stageTwo, INPUT, 5391, false)


//////////////////////////////////////////
//--------- Helper functions ----------//
/////////////////////////////////////////

// Create a starter dictionary of registers set to 0
function initRegisters(lines: string[]): any {
    const registers: any = {}
    lines.forEach(line => {
        const register = line.split(' ')[0]
        registers[register] = 0
    })
    return registers
}

// Parse each line of input into an Instruction
function parseInstructions (lines: string[]): Instruction[] {
    const instructions = lines.map(line => {
        const segments = line.split(' ')
        const instruction: Instruction = {
            register: segments[0],
            operator: segments[1] === 'inc' ? '+' : '-',
            offset: segments[2],
            condition: {
                register: segments[4],
                comparison: `${segments[5]} ${segments[6]}`
            }
        }
        return instruction
    })
    return instructions
}

// Loop through instructions and apply them to the registers
function applyInstructions(registersInput: any, instructions: Instruction[]): any {
    // Avoid mutating original object
    const registers = {...registersInput}
    // Use eval() to execute a text string as JavaScript
    instructions.forEach(i => {
        eval(`
            if (registers['${i.condition.register}'] ${i.condition.comparison}) {
                registers['${i.register}'] = registers['${i.register}'] ${i.operator} ${i.offset}
            }
        `)
    })
    return registers
}

function applyInstructionsMax(registersInput: any, instructions: Instruction[]): number {
    // Avoid mutating original object
    const registers = {...registersInput}
    // Keep track of highest register value
    let highest = Number.MIN_VALUE
    // Use eval() to execute a text string as JavaScript
    instructions.forEach(i => {
        eval(`
            if (registers['${i.condition.register}'] ${i.condition.comparison}) {
                registers['${i.register}'] = registers['${i.register}'] ${i.operator} ${i.offset}
            }
        `)
        // Log highest value
        if (parseInt(registers[i.register]) > highest)
            highest = parseInt(registers[i.register])
    })
    return highest
}