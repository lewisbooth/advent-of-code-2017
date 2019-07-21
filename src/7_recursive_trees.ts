import test from './test'
import INPUT from './inputs/7_recursive_trees'
import EXAMPLE_INPUT from './inputs/7_recursive_trees_example'

interface Node {
    title: string
    weight: number
    totalWeight: number
    children: Node[]
    childrenRefs: string[]
}

// STAGE 1
// A program seems to have gotten stuck precariously in a recursive loop!
// A large tower of discs (programs) stands in front of you. The bottom disc holds several towers 
// of sub-discs each balancing their own towers of sub-sub-...-discs, and so on. At the very 
// top of these towers are discs that keep the below towers balanced, but have no sub-discs.

// Each disc can shout out its name, weight and the names of the discs immediately above it.
// You write this information down (your puzzle input) however the information isn't in order.

// For example, if your list is the following:

// pbga (66)
// xhth (57)
// ebii (61)
// havc (66)
// ktlj (57)
// fwft (72) -> ktlj, cntj, xhth
// qoyq (66)
// padx (45) -> pbga, havc, qoyq
// tknk (41) -> ugml, padx, fwft
// jptl (61)
// ugml (68) -> gyxo, ebii, jptl
// gyxo (61)
// cntj (57)

// ..then you would be able to recreate the structure of the towers like this:

//                 gyxo
//               /     
//          ugml - ebii
//        /      \     
//       |         jptl
//       |        
//       |         pbga
//      /        /
// tknk --- padx - havc
//      \        \
//       |         qoyq
//       |             
//       |         ktlj
//        \      /     
//          fwft - cntj
//               \     
//                 xhth

// The structure standing in front of you is much larger!

// Before you can help the program get unstuck, you need to verify your information.
// What is the name of the bottom program?

function stageOne(input: string): string {
    const parsedNodes = parseNodes(input)
    const rootNode = findRootNode(parsedNodes)
    return rootNode
}

console.log("//---- STAGE 1 ----//")
test(stageOne, EXAMPLE_INPUT, 'tknk', false)
test(stageOne, INPUT, 'azqje', false)


// STAGE 2
// Apparently, one disc has the wrong weight! To fix the program, the tower must be balanced.
// A disc's weight is the total of its own weight and all of its sub-sub...-disc weights. 
// To be balanced, all of its sub-discs must have the same weight.

// In the example above, this means that for ugml's disc to be balanced, gyxo, ebii, and jptl 
// must all have the same weight, and they do: 61. 

// However, for tknk to be balanced, each of the programs standing on its disc and all programs 
// above it must each match. This means that the following sums must all be the same:

//     ugml + (gyxo + ebii + jptl) = 68 + (61 + 61 + 61) = 251
//     padx + (pbga + havc + qoyq) = 45 + (66 + 66 + 66) = 243
//     fwft + (ktlj + cntj + xhth) = 72 + (57 + 57 + 57) = 243

// As you can see, tknk's disc is unbalanced: ugml's stack is heavier than the other two. 
// Even though the nodes above ugml are balanced, ugml itself is too heavy: it needs to be 8 
// units lighter for its stack to weigh 243 and keep the towers balanced. If this change were 
// made, its weight would be 60.

// Given that exactly one program is the wrong weight, what would its weight need to be to 
// balance the entire tower?

function stageTwo(input: string): number {
    const parsedNodes = parseNodes(input)
    const rootNode = findRootNode(parsedNodes)
    const nodeTree = buildTree(parsedNodes, rootNode)
    calcWeights(nodeTree)
    return findFaultyNode(nodeTree)
}

console.log("//---- STAGE 2 ----//")
test(stageTwo, EXAMPLE_INPUT, 60, false)
test(stageTwo, INPUT, 646, false)


//////////////////////////////////////////
//--------- Helper functions ----------//
/////////////////////////////////////////

// Parse data from each line of input and return array of Node objects
function parseNodes(input: string): [Node] {
    const lines = input.split('\n')
    const parsedNodes: any = []
    lines.forEach(line => {
        const weight = parseInt((line.match(/\d+/) || [])[0])
        const title = (line.match(/^[a-z]*/) || [])[0]
        const childString = line.split('-> ')[1] || ''
        const childrenRefs = childString.split(', ') || []
        parsedNodes.push({ title, weight, childrenRefs })
    })
    return parsedNodes
}

// Returns the title of the only Node that is not the child of another Node
function findRootNode(parsedNodes: [Node]): string {
    let rootNode = ''
    parsedNodes.forEach(node => {
        // Check if node is a child of any other node
        const parentNode = parsedNodes.filter(otherNode =>
            otherNode && otherNode.childrenRefs.indexOf(node.title) >= 0
        ).length
        if (!parentNode)
            rootNode = node.title
    })
    return rootNode
}

// Recursively build a nested object of Nodes
function buildTree(parsedNodes: [Node], nodeTitle: string): any {
    if (!nodeTitle) return
    const { title, weight, childrenRefs } = getNode(parsedNodes, nodeTitle)
    return {
        title,
        weight,
        children: childrenRefs.map(child => buildTree(parsedNodes, child))
    }
}

// Extract the given Node from a flat array of Nodes
function getNode(parsedNodes: [Node], title: string): Node {
    return parsedNodes.find(node =>
        node.title === title
    ) || parsedNodes[0]
}

// Add sum of child weights to the nested Node object
function calcWeights(node: Node): any {
    if (!node.children[0])
        return node.weight
    node.totalWeight = node.weight
    node.children.forEach(child => {
        node.totalWeight += calcWeights(child)
    })
    return node.totalWeight
}

// Find the unbalanced Node from a Node tree and return its correct weight
function findFaultyNode(node: Node, correctionOffset: number = 0): number {
    const childWeights = node.children.map(child => child.totalWeight)
    // Find the unique (unbalanced) child weight
    const unbalancedWeight = childWeights.find(value =>
        childWeights.indexOf(value) === childWeights.lastIndexOf(value)
    ) || -1
    // Recursively search for the unbalanced Node
    if (unbalancedWeight >= 0) {
        // Calculate the offset needed for the child Node to be the correct weight
        const correctWeight = childWeights.find(value => value !== unbalancedWeight) || 0
        const offset = correctWeight - unbalancedWeight
        const index = childWeights.indexOf(unbalancedWeight)
        return findFaultyNode(node.children[index], offset)
        // Otherwise return the correct weight to balance the stack
    } else {
        return node.weight + correctionOffset
    }
}