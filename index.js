
'use strict';

const http = require('http');
const crypto = require('crypto');
const axios = require('axios');

const BASE_URL = 'https://api.line.me';
const PUSH_PATH = '/v2/bot/message/push';//プッシュ用
const CH_SECRET = process.env.SECRET || '28109972550be44d8c6c07a170af89b3'; //Channel Secretを指定
const CH_ACCESS_TOKEN = process.env.TOKEN || 'qJdBq6LTx7fZ2YjDWP0T9KYN7ak8+5ZPPZG41KphY52IFkYSB9PxNd+ra4WcgnaiBDWSQq7hY1RB1XhxUXvrYV8PUxGNKfvlnG4Y9Kz0UzJbtQnqU9w6idHudrFz3arUC5LBsX8s1YRKRoFpfHjM1AdB04t89/1O/w1cDnyilFU='; //Channel Access Tokenを指定
const USERID = process.env.USERID || 'Ub17dd35613f128e4d0470db71ae80c07'; //useridを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    if(req.url !== '/' || req.method !== 'POST'){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('hello');
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        if(body === ''){
          console.log('bodyが空です。');
          return;
        }

        let WebhookEventObject = JSON.parse(body).events[0];
        console.log(WebhookEventObject);
        //メッセージが送られて来た場合
        if(WebhookEventObject.type === 'beacon'){
            let SendMessageObject = {
                type: 'text',
                text: 'おかえり'
            };

            axios.request({
                method: 'post',
                baseURL: BASE_URL,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${CH_ACCESS_TOKEN}`
                },
                url: PUSH_PATH,
                data: {to: USERID, messages: [SendMessageObject,SendMessageObject,SendMessageObject,SendMessageObject,SendMessageObject]},
            }).then((res) => {
                console.log(res.status);
            })
            .catch((error) => {
                console.log(error);
            });
        }

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('success');
    });
}).listen(PORT);

console.log(`Server running at ${PORT}`);
