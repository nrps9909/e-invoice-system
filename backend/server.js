const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

let invoices = [];

app.post('/api/upload-invoice', (req, res) => {
  try {
    console.log("收到上傳發票的請求:", req.body);
    const { participant, invoiceNumber } = req.body;
    if (!participant || !invoiceNumber) {
      return res.json({ success: false, message: '缺少參數' });
    }
    if (invoiceNumber.length !== 8 || !/^\d{8}$/.test(invoiceNumber)) {
      return res.json({ success: false, message: '發票號碼必須是8位數字' });
    }
    invoices.push({ participant, invoiceNumber });
    return res.json({ success: true, message: '發票已上傳' });
  } catch (error) {
    console.error("上傳發票錯誤:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/clear-invoices', (req, res) => {
  try {
    console.log("收到清除發票資料的請求");
    const { requester } = req.body;
    const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    if (requester && requester.toLowerCase() !== ownerAddress.toLowerCase()) {
      return res.json({ success: false, message: '未授權的請求' });
    }
    invoices = [];
    return res.json({ success: true, message: '發票資料已清除' });
  } catch (error) {
    console.error("清除發票錯誤:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/get-all-invoices', (req, res) => {
  console.log("收到獲取所有發票的請求");
  return res.json(invoices);
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('錯誤:', err);
  res.status(500).json({ success: false, message: '伺服器內部錯誤' });
});

// 確保伺服器正確啟動
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`後端伺服器已啟動，監聽所有介面，端口 ${port}`);
});

process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信號，正在關閉伺服器...');
  server.close(() => {
    console.log('伺服器已關閉');
    process.exit(0);
  });
});