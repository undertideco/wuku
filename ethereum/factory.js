import web3 from './web3';
import StoryFactory from './build/StoryFactory.json';

const instance = new web3.eth.Contract(
  StoryFactory.abi,
  process.env.STORYFACTORY_CONTRACT_ADDRESS
);

export default instance;
