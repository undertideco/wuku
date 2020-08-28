const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(
  __dirname,
  process.argv[2] === 'test' ? 'build/test' : 'build'
);
fs.removeSync(buildPath);

const storyPath = path.resolve(__dirname, 'contracts', 'Story.sol');
const source = fs.readFileSync(storyPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Story.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output['Story.sol']) {
  fs.outputJSONSync(
    path.resolve(buildPath, `${contract}.json`),
    output['Story.sol'][contract]
  );
}
