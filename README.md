# 去中心化電子發票抽獎系統

這是一個基於以太坊區塊鏈的電子發票抽獎系統，適合資工系學生學習和實作。

## 環境設置

### 1. 安裝必要工具

首先，請確保您已經安裝了以下工具：
- [Node.js](https://nodejs.org/) (建議使用LTS版本)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) 瀏覽器擴充套件

### 2. 克隆專案

使用Git將專案克隆到本地端：

```shell
git clone https://github.com/your-repo/e-invoice-system.git
cd e-invoice-system
```

### 3. 安裝依賴

在專案目錄中，使用npm安裝所有必要的依賴：

```shell
npm install
```

### 4. 配置Hardhat

Hardhat是一個以太坊開發環境。我們需要配置它來部署智能合約。

```shell
npx hardhat
```

選擇 "Create a basic sample project" 並按照提示進行操作。這將會生成一個基本的Hardhat配置。

### 5. 編寫和部署智能合約

在 `contracts` 目錄中已經有一個 `InvoiceLottery.sol` 智能合約。您可以使用以下命令來編譯和部署它：

```shell
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

### 6. 啟動本地開發伺服器

使用Vite啟動前端開發伺服器：

```shell
npm run dev
```

這將會啟動一個本地伺服器，您可以在瀏覽器中打開 `http://localhost:5173` 來查看應用程式。

### 7. 連接MetaMask

打開瀏覽器並連接MetaMask錢包。確保您已經在MetaMask中配置了本地開發網路。

### 8. 使用應用程式

在應用程式中，您可以：
- 連接錢包
- 上傳發票參與抽獎
- 抽取幸運兒（僅限合約Owner）

### 其他指令

您可以使用以下指令來進行更多操作：

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
```

這些指令可以幫助您測試和部署智能合約。

## 結論

這個專案展示了如何使用以太坊智能合約來實現一個去中心化的電子發票抽獎系統。希望這個專案能夠幫助您更好地理解區塊鏈技術和智能合約的應用。
```