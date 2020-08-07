const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../build/StoryFactory.json');
const compiledStory = require('../build/Story.json');

let accounts;
let factory;
let storyAddress;
let story;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createStory('test story').send({
    from: accounts[0],
    gas: '1000000',
    value: '13000000000000000'
  });

  [storyAddress] = await factory.methods.getDeployedStories().call();
  story = await new web3.eth.Contract(
    compiledStory.abi,
    storyAddress
  );
});

describe('Stories', () => {
  it('deploys a factory and a story', () => {
    assert.ok(factory.options.address);
    assert.ok(story.options.address);
  });
});
