const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { advanceTimeAndBlock } = require('./helpers/timeUtils');
const compiledFactory = require('../ethereum/build/contracts/StoryFactory.json');
const compiledStory = require('../ethereum/build/contracts/Story.json');

let accounts;
let factory;
let storyAddress;
let story;

const minStartingContribution = 13000000000000000;
const baseContributionValue = 250000000000000;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '3000000' });

  await factory.methods.createStory('test story').send({
    from: accounts[0],
    gas: '3000000',
    value: minStartingContribution.toString(),
  });

  [storyAddress] = await factory.methods.getDeployedStories().call();
  story = await new web3.eth.Contract(compiledStory.abi, storyAddress);
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

  it('marks host as eligible voter', async () => {
    const approvedVoter = await story.methods.voters(accounts[0]).call();

    assert(approvedVoter);
  });

  it('marks initial contribution as highest voted', async () => {
    const highestVotedContribution = await story.methods
      .getHighestVotedContribution()
      .call();

    assert.equal(highestVotedContribution.description, 'test story');
  });

  it('allow people to make story contribution, increase the minimum contribution', async () => {
    await story.methods.createContribution('first contribution').send({
      value: '250000000000000',
      from: accounts[1],
      gas: '3000000',
    });

    const minContribution = await story.methods.getMinimumContribution().call();
    const contribution = await story.methods.contributions(1).call();
    const contributionsCount = await story.methods
      .getContributionsCount()
      .call();
    const voterApproved = await story.methods.voters(accounts[1]).call();

    assert(voterApproved);
    assert.equal(parseInt(contributionsCount, 10), 2);
    assert.equal(contribution.contributor, accounts[1]);
    assert.equal(minContribution, '500000000000000');
  });

  it('sets current block time as created time', async () => {
    const createdTime = await story.methods.createdTime().call();
    const latestBlock = await web3.eth.getBlock('latest');

    assert.equal(createdTime, latestBlock.timestamp);
  });

  it('return user as contributor', async () => {
    await story.methods.createContribution('first contribution').send({
      value: '250000000000000',
      from: accounts[1],
      gas: '3000000',
    });

    const isContributor = await story.methods.isContributor(accounts[1]).call();
    assert(isContributor);
  });
});

describe('Get Summary', () => {
  it('get summary', async () => {
    await story.methods.createContribution('first contribution').send({
      value: '250000000000000',
      from: accounts[1],
      gas: '3000000',
    });
    const summary = await story.methods.getSummary().call();
    const secondsInDay = 86400;

    assert.equal(summary[0].length, 2);
    assert.equal(summary[1], (baseContributionValue * 2).toString());
    assert.equal(summary[2], accounts[0]);
    assert.equal(summary[3], (secondsInDay * 3).toString());
    assert.equal(summary[4], (secondsInDay * 4).toString());
  });
});

describe('Voting', () => {
  it('do not allow non-contributors to vote', async () => {
    try {
      await story.methods.voteContribution(0).send({
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('allow contributors to vote and change highest voted contribution index', async () => {
    const contributionString = 'first contribution';

    await story.methods.createContribution(contributionString).send({
      value: '250000000000000',
      from: accounts[1],
      gas: '3000000',
    });

    await story.methods.voteContribution(1).send({
      from: accounts[0],
      gas: '3000000',
    });

    const voteCount = await story.methods.getContributionVoteCount(1).call();
    const highestVotedContribution = await story.methods
      .getHighestVotedContribution()
      .call();

    assert.equal(voteCount, 1);
    assert.equal(highestVotedContribution.description, contributionString);
  });

  it('do not allow users to vote for their own contribution', async () => {
    const errorString = 'User not allowed to vote for their own contribution';
    await story.methods.createContribution('some contribution').send({
      value: '250000000000000',
      from: accounts[1],
      gas: '3000000',
    });

    try {
      await story.methods.voteContribution(1).send({
        from: accounts[1],
        gas: '3000000',
      });
      assert(false);
    } catch (err) {
      const errReason = Object.values(err['results'])[0]['reason'];

      assert(err);
      assert.equal(errReason, errorString);
    }
  });
});

const SECONDS_IN_DAY = 86400;

describe('Expire Contributions', () => {
  it('close story from contributions after 3 days', async () => {
    await advanceTimeAndBlock(web3, SECONDS_IN_DAY * 3);

    const hasClosed = await story.methods.hasClosedForContributions().call();

    assert(hasClosed);
  });

  it('close story from voting after 4 days', async () => {
    await advanceTimeAndBlock(web3, SECONDS_IN_DAY * 4);

    const hasClosed = await story.methods.hasClosedForVoting().call();

    assert(hasClosed);
  });
});

describe('Finalize Story Contract', () => {
  it('finalize story and distribute winnings', async () => {
    const contributionString = 'first contribution';

    await story.methods.createContribution(contributionString).send({
      value: '250000000000000',
      from: accounts[1],
      gas: '3000000',
    });

    await story.methods.voteContribution(1).send({
      from: accounts[0],
      gas: '3000000',
    });

    const totalPrizePool = await web3.eth.getBalance(story.options.address);
    const winnerPayout = totalPrizePool * 0.7;
    const winnerWalletBalance = await web3.eth.getBalance(accounts[1]);

    await advanceTimeAndBlock(web3, SECONDS_IN_DAY * 4);

    try {
      const result = await story.methods.finalize().send({
        from: accounts[0],
      });
      assert(true);
    } catch (err) {
      assert(false, err);
    }

    const newWinnerWalletBalance = await web3.eth.getBalance(accounts[1]);
    assert.equal(
      parseInt(newWinnerWalletBalance, 10),
      parseInt(winnerWalletBalance) + parseInt(winnerPayout)
    );
  });

  it('only allow story to finalize after voting is closed', async () => {
    try {
      await story.methods.finalize().send({
        from: accounts[0],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('only story host should be allowed to finalize story', async () => {
    await advanceTimeAndBlock(web3, SECONDS_IN_DAY * 4);

    try {
      await story.methods.finalize().send({
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
});
