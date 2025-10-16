// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
// Onrenderが自動的に割り当てるポートを使用します
const port = process.env.PORT || 3000; 

// =======================================================
// ★★★ ここを転送したいURLに書き換えてください ★★★
const TARGET_URL = 'https://duckduckgo.com/'; 
// =======================================================

// プロキシのセットアップ
// この設定では、https://[あなたのサイト].onrender.com/api/xxx へのリクエストが
// TARGET_URL/xxx へ転送されます。
app.use('/api', createProxyMiddleware({
  target: TARGET_URL, 
  changeOrigin: true, // 外部サイトのホストヘッダーを変更
  pathRewrite: {
    '^/api': '', // リクエストパスから '/api' を取り除く
  },
  logLevel: 'debug' // 動作確認のためにログレベルをデバッグに設定
}));

// ルートパス ( / ) へのアクセス時のメッセージ
app.get('/', (req, res) => {
  res.send(`プロキシサーバーが動作しています。転送先: ${TARGET_URL}。/api/ へのアクセスを試してください。`);
});

app.listen(port, () => {
  console.log(`プロキシサーバーがポート ${port} で起動しました。`);
});
