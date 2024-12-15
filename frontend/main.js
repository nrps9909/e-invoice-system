import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.6.2/dist/ethers.min.js';
import { contractAddress } from './contractAddress.js';

// 引入合約的 ABI JSON 檔案
import contractArtifact from './InvoiceLottery.json';

// 使用編譯後的 ABI
const contractABI = contractArtifact.abi;

let provider;
let signer;
let contract;

async function getAllInvoices() {
  try {
    if (!contract || !contract.runner) {
      throw new Error("合約未初始化");
    }
    const invoices = await contract.getAllInvoices();
    return invoices;
  } catch (error) {
    console.error("獲取發票錯誤:", error);
    return [];
  }
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
  console.log("init function called");
  if (window.ethereum) {
    try {
      // 首先切換到本地網路
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x539' }], // 1337 in hex
        });
      } catch (switchError) {
        // 如果本地網路不存在，則添加它
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x539',
              chainName: 'Localhost 8545',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['http://127.0.0.1:8545']
            }]
          });
        }
      }
      
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      
      // 輸出當��連接的地址和網路資訊，用於調試
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      console.log("Connected address:", address);
      console.log("Network:", network);
      
      contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      // 直接取得合約擁有者地址，不使用 ENS 解析
      try {
        const ownerAddress = await contract.owner();
        const currentAddress = await signer.getAddress();
        console.log("Contract owner address:", ownerAddress);
        console.log("Current address:", currentAddress);
        
        if (currentAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
          alert("當前帳戶不是合約擁有者，無法執行某些操作。");
        }
      } catch (error) {
        console.error("取得合約擁有者地址時發生錯誤:", error);
      }

      document.getElementById('status').innerText = '錢包已連接到本地網路';
      console.log("Wallet connected to local network");
      
      // 取得發票列表
      const invoices = await getAllInvoices();
      if (Array.isArray(invoices)) {
        displayInvoices(invoices);
      }
    } catch (error) {
      console.error("初始化錯誤:", error);
      document.getElementById('status').innerText = '請確保MetaMask連接到本地網路';
    }
  } else {
    alert('請安裝 MetaMask 錢包');
  }
}

document.getElementById('connect').addEventListener('click', () => {
  console.log("Connect button clicked");
  init();
});

document.getElementById('upload').addEventListener('click', async () => {
  console.log("Upload button clicked");
  try {
    if (!signer) {
      alert("請先連接錢包");
      return;
    }
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    if (invoiceNumber.length !== 8 || !/^\d{8}$/.test(invoiceNumber)) {
      alert('請輸入8位數的發票號碼，且只能包含數字');
      return;
    }
    const participantAddress = await signer.getAddress();
    // 將發票號碼和參與者地址發送到後端
    const response = await fetch('http://localhost:3000/api/upload-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant: participantAddress, invoiceNumber })
    });
    const result = await response.json();
    if (result.success) {
      document.getElementById('status').innerText = '發票已上傳至資料庫！';
      console.log("Invoice uploaded to database");
    } else {
      throw new Error(result.message);
    }
    // 重新獲取並顯示發票列表
    const invoices = await getAllInvoicesFromDB();
    displayInvoices(invoices);
  } catch (error) {
    console.error("上傳發票錯誤:", error);
    alert('發生錯誤，請查看控制台');
  }
});

// 新增函式：從後端取得所有發票
async function getAllInvoicesFromDB() {
  try {
    const response = await fetch('http://localhost:3000/api/get-all-invoices'); // 確保使用正確的後端位址和端口
    const invoices = await response.json();
    return invoices;
  } catch (error) {
    console.error("獲取發票錯誤:", error);
    return [];
  }
}

// 修改 draw 按鈕事件
document.getElementById('draw').addEventListener('click', async () => {
  console.log("Draw button clicked");
  try {
    const address = await signer.getAddress();
    const ownerAddress = await contract.owner();
    if (address.toLowerCase() !== ownerAddress.toLowerCase()) {
      alert("只有合約擁有者才能抽取中獎號碼");
      return;
    }

    // 新增：檢查是否已經抽過獎
    const winnerDrawn = await contract.winnerDrawn();
    if (winnerDrawn) {
      alert("已經完成抽獎，請重新部署合約或重置合約狀態。");
      return;
    }

    // 從後端取得所有發票
    const invoices = await getAllInvoicesFromDB();
    if (!invoices || invoices.length === 0) {
      alert("目前沒有任何發票可以抽獎");
      return;
    }

    // 取得參與者地址和發票號碼陣列
    const participants = invoices.map(invoice => invoice.participant);
    const invoiceNumbers = invoices.map(invoice => invoice.invoiceNumber);

    console.log("準備上傳發票到區塊鏈:", { participants, invoiceNumbers });

    // 設置較高的 gas limit
    const gasLimit = await contract.uploadAllInvoices.estimateGas(participants, invoiceNumbers);
    const adjustedGasLimit = gasLimit * 120n / 100n; // 使用 BigInt 進行計算

    const tx = await contract.uploadAllInvoices(participants, invoiceNumbers, {
      gasLimit: adjustedGasLimit
    });
    
    console.log("等待交易確認...");
    const receipt = await tx.wait();
    console.log("發票上傳成功，交易收據:", receipt);

    // 調用抽獎函式
    console.log("開始抽獎...");
    const txDraw = await contract.drawWinningNumbers({
      gasLimit: 500000 // 設置足夠高的 gas limit
    });
    await txDraw.wait();
    
    // 獲取中獎號碼並顯示
    const [specialPrize, grandPrize, firstPrizes] = await contract.getWinningNumbers();
    document.getElementById('status').innerText = `中獎號碼：
    特別獎：${specialPrize}
    特獎：${grandPrize}
    頭獎：${firstPrizes.join(', ')}`;
    console.log("Winning numbers drawn");
    // 檢查使用者是否中獎
    const isWinner = await contract.checkIfWinner(await signer.getAddress());
    if (isWinner) {
      alert('恭喜，您有中獎的發票！');
    } else {
      alert('很遺憾，您沒有中獎的發票。');
    }
    // 在抽獎完成後，自動清除後端的發票資料
    await fetch('http://localhost:3000/api/clear-invoices', {
      method: 'POST',
    });
    console.log("後端發票資料已清除");
  } catch (error) {
    console.error("抽獎錯誤詳細資訊:", error);
    if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      alert('Gas 限制計算失敗，請確保合約狀態正確');
    } else if (error.code === -32603) {
      alert('MetaMask 交易失敗，請重置 MetaMask 後重試');
    } else {
      alert('發生錯誤，請查看控制台');
    }
  }
});

// 添加「清除發票資料」按鈕的事件處理器
document.getElementById('clear').addEventListener('click', async () => {
  console.log("Clear button clicked");
  try {
    // 可選：檢查當前帳戶是否為合約擁有者
    const address = await signer.getAddress();
    const ownerAddress = await contract.owner();
    if (address.toLowerCase() !== ownerAddress.toLowerCase()) {
      alert("只有合約擁有者才能清除發票資料");
      return;
    }

    const response = await fetch('http://localhost:3000/api/clear-invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requester: address }) // 傳送 requester
    });
    const result = await response.json();
    if (result.success) {
      alert("發票資料已清除");
      // 更新前端的發票列表
      const invoices = await getAllInvoicesFromDB();
      displayInvoices(invoices);
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("清除發票資料錯誤:", error);
    alert('發生錯誤，請查看控制台');
  }
});

// 添加重置按鈕事件處理器
document.getElementById('reset').addEventListener('click', async () => {
  console.log("Reset button clicked");
  try {
    const address = await signer.getAddress();
    const ownerAddress = await contract.owner();
    if (address.toLowerCase() !== ownerAddress.toLowerCase()) {
      alert("只有合約擁有者才能重置抽獎");
      return;
    }

    const durationMinutes = 60; // 設定新的抽獎時間
    console.log("重置抽獎...");
    const tx = await contract.resetLottery(durationMinutes, {
      gasLimit: 500000
    });
    await tx.wait();
    
    // 清除後端資料
    await fetch('http://localhost:3000/api/clear-invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requester: address })
    });

    // 更新顯示
    document.getElementById('status').innerText = '抽獎已重置';
    displayInvoices([]);
    
    console.log("抽獎重置完成");
  } catch (error) {
    console.error("重置錯誤:", error);
    alert('重置失敗，請查看控制台');
  }
});
