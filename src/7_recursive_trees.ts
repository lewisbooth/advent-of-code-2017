import test from "./test"
import INPUT from "./inputs/7_recursive_trees"
import EXAMPLE_INPUT from "./inputs/7_recursive_trees_example"

// STAGE 1

function stageOne(input: string) {
    const parsedNodes = parseNodes(input)
    const rootNode = getRootNode(parsedNodes)
    return rootNode
}

test(stageOne, EXAMPLE_INPUT, 'tknk', false)
test(stageOne, INPUT, 'azqje', false)


interface Node {
    title: string
    weight: number
    children: string[]
}

// Parse data from each line of input and return array of Node objects
function parseNodes(input: string): [Node] {
    const lines = input.split('\n')
    const parsedNodes:any = []
    lines.forEach(line => {
        const weight = parseInt((line.match(/\d+/) || [])[0])
        const title = (line.match(/^[a-z]*/) || [])[0]
        const childString = line.split('-> ')[1] || ''
        const children = childString.split(', ') || []
        parsedNodes.push({ title, weight, children })
    })
    return parsedNodes
}

// Finds the only node that is not the child of another node
function getRootNode(parsedNodes: [Node]) {
    let rootNode = ''
    parsedNodes.forEach(node => {
        // Check if node is a child of any other node
        const parentNode = parsedNodes.filter(otherNode => 
            otherNode && otherNode.children.indexOf(node.title) >= 0
        ).length
        if (!parentNode) 
            rootNode = node.title
    })
    return rootNode
}