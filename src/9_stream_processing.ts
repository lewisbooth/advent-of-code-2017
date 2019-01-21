import test from './test'
import INPUT from './inputs/9_stream_processing'


function stageOne(input: string): number {
    const cleaned = input
        // Delete all instances of '!' and the following character 
        .replace(/!./g, '')
        // Delete anything inside pairs of angle brackets
        // The question mark is 'non-greedy', i.e. matches will stop at the next occurence of '>'
        // Otherwise it would delete everything between the first and last bracket in the string
        .replace(/<.*?>/g, '')
    return 1
}

test(stageOne, '{}', 1)
test(stageOne, '{{{},{},{{}}}}', 16)
test(stageOne, '{<a>,<a>,<a>,<a>}', 1)
test(stageOne, '{{<!!>},{<!!>},{<!!>},{<!!>}}', 9)