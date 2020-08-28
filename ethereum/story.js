import web3 from './web3';
import Story from './build/Story.json';

const story = (address) => {
  return new web3.eth.Contract(Story.abi, address);
};

export default story;
