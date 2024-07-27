const express = require('express')
const app = express()
const port = 3000


var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

app.use(connectLiveReload());

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})