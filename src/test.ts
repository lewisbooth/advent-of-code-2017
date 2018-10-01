// Basic importable testing function
// Logs the function params followed by PASS or FAIL.

export default (func:Function, input:any, target:any, printInput?: boolean) => {
    const result = func(input)
    console.log(`${printInput === false ? "" : "Input: " + input + " "}Result: ${result}  Expected: ${target}`)
    if (result === target)
        console.log("\x1b[32m%s\x1b[0m", `PASS`)
    else
        console.log("\x1b[31m%s\x1b[0m", `FAIL`)
}