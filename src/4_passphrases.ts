import test from "./test"
import PASSPHRASES from "./4_passphrases_input"

// STAGE 1
// A passphrase consists of a series of words (lowercase letters) separated by spaces.
// A valid passphrase must contain no duplicate words.
// Use the puzzle input (imported above) and return the number of valid passhphrases.
// Passphrases are listed one per line.

// EXAMPLES
// aa bb cc dd ee is valid.
// aa bb cc dd aa is not valid - the word aa appears more than once.
// aa bb cc dd aaa is valid - aa and aaa count as different words.

const stageOne = (passphrases: string): number => {
    return passphrases
        .split('\n')
        .filter(hasDuplicateWords)
        .length
}

test(stageOne, PASSPHRASES, 337, false)

// STAGE 2
// An additional password policy has been put in place.
// A valid passphrase must not contain words that are anagrams of each other.
// All letters of a word must be used when forming another word.

// EXAMPLES
// abcde fghij is a valid passphrase.
// abcde xyz ecdab is not valid - the letters from the third word can be rearranged to form the first word.
// a ab abc abd abf abj is a valid passphrase, because all letters need to be used when forming another word.
// iiii oiii ooii oooi oooo is valid.
// oiii ioii iioi iiio is not valid - any of these words can be rearranged to form any other word.

const stageTwo = (passphrases: string): number => {
    return passphrases
        .split('\n')
        // Keep the duplicates algorithm to avoid unnecessary checking for anagrams 
        .filter(hasDuplicateWords)
        .filter(hasAnagrams)
        .length
}

test(stageTwo, PASSPHRASES, 231, false)



//////////////////

function hasDuplicateWords (line: string): boolean {
    let valid = true
    const words = line.split(" ")
    words.forEach((word, i) => {
        words.forEach((otherWord, j) => {
            if (i !== j && word === otherWord) valid = false
        })
    })
    return valid
}

function hasAnagrams(line: string): boolean {
    let valid = true
    const words = line.split(" ")
    words.forEach((word, i) => {
        words.forEach((otherWord, j) => {
            if (i !== j && isAnagram(word, otherWord)) {
                valid = false
            }
        })
    })
    return valid
}

function isAnagram(firstWord: string, secondWord:string): boolean {
    // Word lengths must match
    if (firstWord.length !== secondWord.length) {
        return false
    }
    const firstWordArray = firstWord.split("")
    const secondWordArray = secondWord.split("")
    // Loop through letters1 and remove matches from letters2
    firstWordArray.forEach(letter => {
        const index = secondWordArray.indexOf(letter)
        if (index >= 0) {
            secondWordArray.splice(index, 1)
        }
    })
    // If there no letters left in letters2, it's an anagram
    return secondWordArray.length === 0
}