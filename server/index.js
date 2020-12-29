const http = require('http');
const formidable = require('formidable')
const queryString = require('querystring');

const server = http.createServer((req, res) => {
    const { url, method } = req;
    console.log(url, method);
    // 首先允许8080 跨域
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080")

    // 允许复杂请求
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST")

    // 复杂请求携带header参数
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,token")

    // 允许跨域cookie
    res.setHeader('Access-Control-Allow-Credentials', 'true');



    // 处理一下预检请求

    if (method === 'OPTIONS') {
        res.end('')
    }

    if (url === '/jsonp?callback=jsonp' && method === 'GET') {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.end(`
            jsonp({ name: 'jsonp' })
        `)
    }



    if (url === '/upload_form' && method === 'POST') {
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ fields, files }, null, 2));
        });
        return;
    }




    if (url === '/user' && method === 'GET') {
        res.end(JSON.stringify({ name: 'lucas' }))
    }
    if (url === '/login' && method === 'POST') {
        if (req.headers.cookie) {
            res.end(`already logged in`);
        } else {
            res.setHeader('Set-Cookie', 'username=lucas;')
            res.end(`login successfully`);
        }
    }
    if (url === '/user/save' && method === 'POST') {
        res.setHeader("Content-Type", "application/json")
        const postData = [];
        req.on('data', data => {
            postData.push(data)
        })

        req.on('end', () => {
            let data = JSON.parse(postData.toString());
            res.end(JSON.stringify({ message: 'ok', data }))
        })
    }


    if (url === '/user/edit' && (method === 'PUT' || method === 'POST')) {
        console.log(req.headers);
        res.end(`edit`)
    }





})

server.listen(3000, () => {
    console.log(`server app listen on 3000`);
})


module.exports = server