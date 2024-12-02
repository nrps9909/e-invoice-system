import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.6.2/dist/ethers.min.js';

const contractAddress = '0xAEE728f25F1Ac9Bebabe26D15fd7fA7a98E28938'; // 替換為您的合約地址
const contractABI = [

    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_durationMinutes",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "participant",
            "type": "address"
          }
        ],
        "name": "InvoiceUploaded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "winner",
            "type": "address"
          }
        ],
        "name": "WinnerSelected",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "drawWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getParticipants",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "lotteryEndTime",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "participants",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "uploadInvoice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "winner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "winnerDrawn",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
];

let provider;
let signer;
let contract;

async function init() {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    document.getElementById('status').innerText = '錢包已連接';
  } else {
    alert('請安裝 MetaMask 錢包');
  }
}

document.getElementById('connect').addEventListener('click', init);

document.getElementById('upload').addEventListener('click', async () => {
  try {
    const tx = await contract.uploadInvoice();
    await tx.wait();
    document.getElementById('status').innerText = '發票已上傳，您已參與抽獎！';
  } catch (error) {
    console.error(error);
    alert('發生錯誤，請查看控制台');
  }
});

document.getElementById('draw').addEventListener('click', async () => {
  try {
    const tx = await contract.drawWinner();
    await tx.wait();
    const winnerAddress = await contract.winner();
    document.getElementById('status').innerText = `幸運兒是：${winnerAddress}`;
  } catch (error) {
    console.error(error);
    alert('發生錯誤，請查看控制台');
  }
});
