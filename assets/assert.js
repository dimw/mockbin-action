const fs = require('fs');

// Load file
const callFileName = getOption('call-file');
let callResults = JSON.parse(fs.readFileSync(callFileName, 'utf8'));

// Load index in file
const callIndexStr = getOption('call-index');
const callIndex = parseInt(callIndexStr || 0);
const callResult = callResults[callIndex];

// Get and stringify expected output
const expectedArgsStr = getOption('expected-args');

// Get and stringify expected output
const expectedStdin = getOption('expected-stdin');

// Validate args
if (expectedArgsStr) {
  const expectedArgs = JSON.parse(expectedArgsStr);

  assert(expectedArgs, callResult.args);
}

// Validate stdin
if (expectedStdin) {
  const actualStdin = callResult.stdin;
  assert(expectedStdin, actualStdin);
}


function getOption(name) {
  const index = process.argv.indexOf(`--${name}`);
  if (index > -1) {
    return process.argv[index + 1];
  }
}

function assert(expected, actual) {
  expected.forEach((expectedVal, index) => {
    const actualVal = actual[index];
    const expectedRegexp = new RegExp(`^${expectedVal}$`);
    if (!expectedRegexp.test(actualVal)) {
      console.error(`ERROR: Assertion at index ${index}, expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}!`);
      process.exit(1);
    }
  });
}
