import { Web3 } from 'web3';
export const web3 = new Web3(window.ethereum);

export const campusMarketAddress = '';

export const campusMarketABI = [];
export const campusMarketContract = new web3.eth.Contract(campusMarketABI, campusMarketAddress);


