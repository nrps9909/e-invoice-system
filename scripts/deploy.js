const hre = require("hardhat");

async function main() {
  const InvoiceLottery = await hre.ethers.getContractFactory("InvoiceLottery");
  const durationMinutes = 60; // 設定抽獎持續時間為 60 分鐘
  const invoiceLottery = await InvoiceLottery.deploy(durationMinutes);
  await invoiceLottery.waitForDeployment();

  const address = await invoiceLottery.getAddress();
  console.log("InvoiceLottery deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("部署失败:", error);
    process.exit(1);
  });
