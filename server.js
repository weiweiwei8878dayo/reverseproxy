// netlify/functions/proxy.js

// Netlify Functionsのエントリーポイント
// Netlifyがリクエストを受け取ると、このhandlerが実行されます。
const { createProxyMiddleware } = require('http-proxy-middleware');
const serverless = require('serverless-http');

// Expressアプリを再利用
const express = require('express');
const app = express();

const TARGET_URL = 'https://jsonplaceholder.typicode.com'; // テスト用API

// プロキシのセットアップ
// Netlifyのリライトルールで /api/ がここにルーティングされます
app.use('/', createProxyMiddleware({ 
  target: TARGET_URL, 
  changeOrigin: true, 
  pathRewrite: {
    '^/': '', // ルートパスにルーティングされるため、パスを空にする
  },
  // ヘッダーを制御する必要がある場合は、ここで設定します
}));

// Expressアプリをサーバーレス関数としてラップ
const handler = serverless(app);

module.exports.handler = async (event, context) => {
    // Netlify FunctionsでCORSが必要な場合はここで設定できます
    // event.headers["Access-Control-Allow-Origin"] = "*";
    
    return handler(event, context);
};
