const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/test/StoryFactory.json');
const compiledStory = require('../ethereum/build/test/Story.json');

let accounts;
let factory;
let storyAddress;
let story;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '3000000' });

  await factory.methods.createStory('test story').send({
    from: accounts[0],
    gas: '3000000',
    value: '13000000000000000'
  });

  [storyAddress] = await factory.methods.getDeployedStories().call();
  story = await new web3.eth.Contract(
    compiledStory.abi,
    storyAddress
  );
});

describe('Stories and Contributions', () => {
  it('deploys a factory and a story', () => {
    assert.ok(factory.options.address);
    assert.ok(story.options.address);
  });

  it('marks caller as story host', async () => {
    const host = await story.methods.host().call();
    assert.equal(accounts[0], host);
  });

  it('marks host as eligible voter', async() => {
    const approvedVoter = await story.methods.voters(accounts[0]).call();

    assert(approvedVoter);
  });

  it("allow people to make story contribution, increase the minimum contribution", async () => {
    await story.methods.createContribution('first contribution').send({
      value: '250000000000000',
      from: accounts[1],
      gas: '3000000'
    });

    const minContribution = await story.methods.getMinimumContribution().call();
    const contribution = await story.methods.contributions(1).call();
    const contributionsCount = await story.methods.getContributionsCount().call();
    const voterApproved = await story.methods.voters(accounts[1]).call();

    assert(voterApproved);
    assert.equal(parseInt(contributionsCount, 10), 2);
    assert.equal(contribution.contributor, accounts[1]);
    assert.equal(minContribution, '500000000000000')
  });
});

describe("Get Summary", () => {
  it("get summary", async () => {
    const summary = await story.methods.getSummary().call();
    console.log(summary);

    assert.equal(summary[0].length, 1)
    assert.equal(summary[1], '250000000000000')
    assert.equal(summary[2], accounts[0])
  })
})

describe ('Voting', () => {
  it("do not allow non-contributors to vote", async() => {
    try {
      await story.methods.voteContribution(0).send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('allow contributors to vote', async() => {
    await story.methods.createContribution('first contribution').send({
      value: '250000000000000',
      from: accounts[1],
      gas: '3000000'
    });

    await story.methods.voteContribution(1).send({
      from: accounts[0],
      gas: '3000000'
    });

    const voteCount = await story.methods.getContributionVoteCount(1).call();
    
    assert.equal(voteCount, 1);
  });
});
