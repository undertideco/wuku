import StoryFactory from './build/contracts/StoryFactory.json';
import web3 from './web3';

const instance = new web3.eth.Contract(
  StoryFactory.abi,
  process.env.NEXT_PUBLIC_STORYFACTORY_CONTRACT_ADDRESS
);

export default instance;
