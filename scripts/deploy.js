const hre = require("hardhat");

async function main() {
  const InvoiceLottery = await hre.ethers.getContractFactory("InvoiceLottery");
  const durationMinutes = 10; // 设置抽奖持续时间，您可以根据需要调整
  const invoiceLottery = await InvoiceLottery.deploy(durationMinutes);

  // 在 ethers.js v6 中，不需要等待 deployed()

  console.log("InvoiceLottery deployed to:", invoiceLottery.target); // 注意，这里使用 `target` 而非 `address`
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("部署失败:", error);
    process.exit(1);
  });
