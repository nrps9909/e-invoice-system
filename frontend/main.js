import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.6.2/dist/ethers.min.js';

const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F05128'; // 替換為您的合約地址
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
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "checkIfWinner",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
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
    "name": "drawWinningNumbers",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "drawn",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
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
    "name": "firstPrizes",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllInvoices",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "participant",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "invoiceNumber",
            "type": "string"
          }
        ],
        "internalType": "struct InvoiceLottery.Invoice[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
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
    "name": "getWinningNumbers",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "grandPrize",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
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
    "name": "invoices",
    "outputs": [
      {
        "internalType": "address",
        "name": "participant",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "invoiceNumber",
        "type": "string"
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
    "name": "specialPrize",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_invoiceNumber",
        "type": "string"
      }
    ],
    "name": "uploadInvoice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userInvoices",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
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

async function getAllInvoices() {
  const invoices = await contract.getAllInvoices();
  return invoices;
}

function displayInvoices(invoices) {
  const invoiceList = document.getElementById('invoiceList');
  invoiceList.innerHTML = '';
  invoices.forEach(invoice => {
    const listItem = document.createElement('li');
    listItem.innerText = `地址：${invoice.participant}，發票號碼：${invoice.invoiceNumber}`;
    invoiceList.appendChild(listItem);
  });
}

async function init() {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    document.getElementById('status').innerText = '錢包已連接';
    // 新增部分：取得並顯示所有發票
    const invoices = await getAllInvoices();
    displayInvoices(invoices);
  } else {
    alert('請安裝 MetaMask 錢包');
  }
}

document.getElementById('connect').addEventListener('click', init);

document.getElementById('upload').addEventListener('click', async () => {
  try {
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    if (invoiceNumber.length !== 8) {
      alert('請輸入8位數的發票號碼');
      return;
    }
    const tx = await contract.uploadInvoice(invoiceNumber);
    await tx.wait();
    document.getElementById('status').innerText = '發票已上傳！';
  } catch (error) {
    console.error(error);
    alert('發生錯誤，請查看控制台');
  }
});

document.getElementById('draw').addEventListener('click', async () => {
  try {
    const tx = await contract.drawWinningNumbers();
    await tx.wait();
    const [specialPrize, grandPrize, firstPrizes] = await contract.getWinningNumbers();
    document.getElementById('status').innerText = `中獎號碼：
    特別獎：${specialPrize}
    特獎：${grandPrize}
    頭獎：${firstPrizes.join(', ')}`;
    // 新增部分：檢查使用者是否中獎
    const isWinner = await contract.checkIfWinner(await signer.getAddress());
    if (isWinner) {
      alert('恭喜，您有中獎的發票！');
    } else {
      alert('很遺憾，您沒有中獎的發票。');
    }
  } catch (error) {
    console.error(error);
    alert('發生錯誤，請查看控制台');
  }
});
