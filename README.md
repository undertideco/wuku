# wuku

## Description
Wuku is a word-game designed to be built on top of the Ethereum blockchain. The concept is simple: 

1. Start a haiku with the first 2 phrases of five and seven syllables respectively.
2. Set a starting pot of $ for your story.
3. Let others contribute a third phrase!
4. At the end of 3 days, contributions close and contributors have 1 day to vote for their favorite third phrase
5. The winner of the most popular phrase gets 70% of the prize pot at that moment, with the remaining 30% going to the story creator.

## Requirements
1. Node
2. Yarn
3. Metamask Installed on Metamask-supported Browser

## Getting Started

### Setting up Development Environment
1. Run `yarn` to install dependencies
2. Run `yarn compile` to compile Solidity contracts. (You should see `Story.json` and `StoryFactory.json` show up in `ethereum/build`)
3. Copy `.env.example` to `.env`

### Connecting to an Ethereum Node/Provider
1. To get `SEED_PHRASE` and `PROVIDER_URL` for `.env`, you need to either run your own Ethereum node or use a provider like [Infura](https://infura.io/). The easiest solution is obviously the latter, so I recommend signing up, creating a new app, and copying the seed phrase and URL to the .env file instead.
2. Run `truffle migrate --reset --network rinkeby` to deploy an instance of the `StoryFactory` contract on the copy of the Ethereum blockchain that your provider is connected to. The terminal should return an address the contract is deployed to. Copy that, and paste it into `.env`
3. You will never have to do the steps in this section again, unless the source of the Solidity contract changes
4. If you already know how to get Ether from a faucet, skip the next section.

### Getting Some Ether for Testing
1. Click on MetaMask on your browser and unlock it
2. Copy your wallet address to your clipboard
![image](https://user-images.githubusercontent.com/5944973/90185315-5ffee180-dd6b-11ea-810d-900fb0909dc7.png)
3. Tweet it
![image](https://user-images.githubusercontent.com/5944973/90185320-642aff00-dd6b-11ea-866f-30de1e6fa6d8.png)
4. Copy the link to the tweet into https://faucet.rinkeby.io/
![image](https://user-images.githubusercontent.com/5944973/90185920-398d7600-dd6c-11ea-9936-b8d13283303e.png)
5. Voila! Ether!

### Starting the app
1. Run `yarn start`
2. Navigate to `localhost:3000`
3. Done!
