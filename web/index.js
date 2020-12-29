const http = require('http');
const fs = require('fs');
const path = require('path');


const app = http.createServer((req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
        res.end(data.toString())
    })
})

app.listen(8080, () => {
    console.log(`web app listen on 8080`);
})

module.exports = app