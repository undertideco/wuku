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

  it('marks caller as story host', async () => {
    const host = await story.methods.host().call();
    assert.equal(accounts[0], host);
  });

  it("allow people to make story contribution and increase the minimum contribution", async () => {
    await story.methods.createContribution('first contribution').send({
      value: '250000000000000',
      from: accounts[1]
    });

    const minContribution = await story.methods.getMinimumContribution().call();
    const contribution = await story.methods.contributions(0).call();

    assert.equal(contribution.contributor, accounts[1]);
    assert.equal(minContribution, '500000000000000')
  });
});
