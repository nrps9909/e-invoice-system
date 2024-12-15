const hre = require("hardhat");
const path = require('path');
const fs = require('fs');

async function main() {
  // 避免 Chain ID 不一致，確保使用正確的網絡
  const network = await hre.network;
  console.log("當前網絡名稱：", network.name);
  console.log("當前 Chain ID：", network.config.chainId);

  const InvoiceLottery = await hre.ethers.getContractFactory("InvoiceLottery");
  const durationMinutes = 60;
  
  console.log("開始部署合約...");
  const invoiceLottery = await InvoiceLottery.deploy(durationMinutes);
  await invoiceLottery.waitForDeployment();
  
  const address = await invoiceLottery.getAddress();
  console.log("InvoiceLottery deployed to:", address);

  // 修正：使用 path.join 來建構正確的檔案路徑
  const contractAddressPath = path.join(__dirname, '..', 'frontend', 'contractAddress.js');
  fs.writeFileSync(
    contractAddressPath,
    `export const contractAddress = '${address}';\n`,
    'utf-8'
  );
  
  // 將新的合約地址寫入文件或直接更新前端使用
  
  // 驗證合約部署
  const code = await hre.ethers.provider.getCode(address);
  if (code === '0x') {
    throw new Error('合約部署失敗');
  }
}

// 修正 Promise chain 的語法
main()
  .then(() => {
    console.log("部署完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("部署失敗:", error);
    process.exit(1);
  });
