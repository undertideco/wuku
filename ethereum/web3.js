import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  window.web3.currentProvider.enable();
  web3 = new Web3(window.web3.currentProvider);
} else {
  const provider = new Web3.providers.HttpProvider(
    process.env.NEXT_PROVIDER_URL
  );
  web3 = new Web3(provider);
}

export default web3;
