const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
// Netlify Functionsで必要だった serverless-http は削除します
// const serverless = require('serverless-http'); 

const app = express();
// 環境変数 PORT を利用できない場合は、3000 をデフォルトとして使用します
const PORT = process.env.PORT || 3000; 

// ターゲットURLを環境変数から取得することを強く推奨します
const TARGET_URL = process.env.TARGET_URL || 'https://jsonplaceholder.typicode.com'; 

// ====================================================

// 1. ルートへのアクセス: サーバーが動作していることを確認
app.get('/', (req, res) => {
  res.send(`プロキシサーバーが Koyeb で動作中です。転送先: ${TARGET_URL}。/api/ へのアクセスを試してください。`);
});

// 2. プロキシのセットアップ: /api 以下のリクエストをターゲットへ転送
app.use('/api', createProxyMiddleware({
  target: TARGET_URL, 
  changeOrigin: true, // ターゲットへのヘッダーのホスト名を変更
  pathRewrite: {
    '^/api': '', // /api を削除してターゲットに転送
  }
}));

// サーバー起動
app.listen(PORT, () => {
  console.log(`プロキシサーバーはポート ${PORT} で起動しました`);
  console.log(`転送先: ${TARGET_URL}`);
});

// ====================================================

// Koyebは通常のWebサービスとして動作するため、
// Netlify Functionsで必要だった handler 関数へのエクスポートは不要です。
