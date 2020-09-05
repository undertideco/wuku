import Story from './build/contracts/Story.json';
import web3 from './web3';

const story = (address) => {
  return new web3.eth.Contract(Story.abi, address);
};

export default story;
