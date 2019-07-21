import INPUT from './inputs/10_knot_hash'

// STAGE 1
// This hash function simulates tying a knot in a circle of string with 256 marks on it.
// Based on the input to be hashed, the function repeatedly selects a span of string,
// brings the ends together, and gives the span a half - twist to reverse the order of the
// marks within it. After doing this many times, the order of the marks is used to build
// the resulting hash.

//   4--5   pinch     4  5           4   1
//  /    \  5, 0, 1  / \/ \  twist  / \ / \
// 3      0  -- >   3      0  -- > 3   X   0
//  \    /           \ /\ /         \ / \ /
//   2--1             2  1           2   5

// To achieve this, begin with a list of numbers from 0 to 255, a current position which begins
// at 0(the first element in the list), a skip size(which starts at 0), and a sequence of
// lengths(your puzzle input). Then, for each length:

//     - Reverse the order of that length of elements in the list, starting with the element
//       at the current position.
//     - Move the current position forward by that length plus the skip size.
//     - Increase the skip size by one.

// The list is circular; if the current position and the length try to reverse elements beyond
// the end of the list, the operation reverses using as many extra elements as it needs from
// the front of the list.If the current position moves past the end of the list, it wraps around
// to the front.Lengths larger than the size of the list are invalid.


function stageOne(list: number[], lengths: number[]): number {
    let position = 0

    lengths.forEach((length, skip) => {
        let span = []

        // Find the span of numbers to reverse using modulo to wrap around the array
        for (let i = 0; i < length; i++)
            span.push(list[(position + i) % list.length])

        span.reverse()

        // Feed the reversed numbers back into the array
        for (let i = 0; i < length; i++)
            list[(position + i) % list.length] = span[i]

        // Increment position and wrap around array
        position = (position + length + skip) % list.length
    })

    return list[0] * list[1]
}

console.log(stageOne([0, 1, 2, 3, 4], [3, 4, 1, 5]))
console.log(stageOne([...Array(256).keys()], INPUT))