import test from './test'
import INPUT from './inputs/9_stream_processing'

// STAGE 1
// A large stream of garbled data (puzzle input) sits in front of you.
// The characters represent groups - sequences that begin with { and end with }. 
// Within a group, there are zero or more other things, separated by commas: either another group or garbage.
// Since groups can contain other groups, a } only closes the most-recently-opened unclosed group - that is,
// they are nestable. Your puzzle input is a single, large group which itself contains many smaller ones.

// Sometimes, instead of a group, you will find garbage. Garbage begins with < and ends with >. 
// Between those angle brackets, any character can appear including { and }. 
// Within garbage, < has no special meaning.

// In a futile attempt to clean up the garbage, some program has canceled some of the characters using !.
// Inside garbage, any character that comes after ! should be ignored, including <, >, and even another !.

// You don't see any characters that deviate from these rules. Outside garbage, you only find well-formed
// groups, and garbage always terminates according to the rules above.

// Here are some examples of whole streams and the number of groups they contain:
//     {}, 1 group.
//     {{{}}}, 3 groups.
//     {{},{}}, also 3 groups.
//     {{{},{},{{}}}}, 6 groups.
//     {<{},{},{{}}>}, 1 group (which itself contains garbage).
//     {<a>,<a>,<a>,<a>}, 1 group.
//     {{<a>},{<a>},{<a>},{<a>}}, 5 groups.
//     {{<!>},{<!>},{<!>},{<a>}}, 2 groups (since all but the last > are canceled).

// Your goal is to find the total score for all groups in your input. Each group is assigned a score which is
// one more than the score of the group that immediately contains it. (The outermost group gets a score of 1.)

//     {}, score of 1.
//     {{{}}}, score of 1 + 2 + 3 = 6.
//     {{},{}}, score of 1 + 2 + 2 = 5.
//     {{{},{},{{}}}}, score of 1 + 2 + 3 + 3 + 3 + 4 = 16.
//     {<a>,<a>,<a>,<a>}, score of 1.
//     {{<ab>},{<ab>},{<ab>},{<ab>}}, score of 1 + 2 + 2 + 2 + 2 = 9.
//     {{<!!>},{<!!>},{<!!>},{<!!>}}, score of 1 + 2 + 2 + 2 + 2 = 9.
//     {{<a!>},{<a!>},{<a!>},{<ab>}}, score of 1 + 2 = 3.

// What is the total score for all groups in your input?

function stageOne(input: string): number {
    // Remove unneccessary items from the input
    const brackets = input
        // Delete all instances of '!' and the following character 
        .replace(/!./g, '')
        // Delete anything inside pairs of angle brackets
        // The question mark means 'non-greedy', i.e. matches will stop at the next occurence of '>'
        .replace(/<.*?>/g, '')
        // Delete everything else that isn't a bracket
        .replace(/[^{}]/g, '')
        // Split into array for iteration
        .split('')
    // Keep track of position and score
    let score = 0
    let depth = 1
    // Iterate through the characters
    brackets.forEach(bracket => {
        if (bracket === '{') {
            // Increment the score by the current depth count, then open a new group
            score += depth
            depth++
        } else {
            // Close the group and continue
            depth--
        }
    })
    return score
}

console.log("//---- STAGE 1 ----//")
test(stageOne, '{}', 1, false)
test(stageOne, '{{{},{},{{}}}}', 16, false)
test(stageOne, '{{<!!>},{<!!>},{<!!>},{<!!>}}', 9, false)
test(stageOne, INPUT, 21037, false)


// STAGE 2
// Now, you're ready to remove the garbage.

// To prove you've removed it, you need to count all of the characters within the garbage. 
// The leading and trailing < and > don't count, nor do any canceled characters or the ! doing the canceling.

//     <>, 0 characters.
//     <random characters>, 17 characters.
//     <<<<>, 3 characters.
//     <{!>}>, 2 characters.
//     <!!>, 0 characters.
//     <!!!>>, 0 characters.
//     <{o"i!a,<{i<a>, 10 characters.

// How many non-canceled characters are within the garbage in your puzzle input?

function stageTwo(input: string): number {
    const garbage = input
        // Delete all instances of '!' and the following character 
        .replace(/!./g, '')
        // Extract remaining garbage into an array
        .match(/<(.*?)>/g)
        // Default to empty array if no garbage is found
        || []
    // Calculate the total length of garbage, adjusting for enclosing brackets
    return garbage.join('').length - garbage.length * 2
}

console.log("//---- STAGE 2 ----//")
test(stageTwo, '<>', 0, false)
test(stageTwo, '<random characters>', 17, false)
test(stageTwo, '<{o"i!a,<{i<a>', 10, false)
test(stageTwo, INPUT, 9495, false)