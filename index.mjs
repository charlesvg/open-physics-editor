import express from "express";
const app = express()
const port = 3000
import open from 'open';
import livereload from "livereload";
import connectLiveReload from "connect-livereload";

// var livereload = require("livereload");
// var connectLiveReload = require("connect-livereload");

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

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    open('http://localhost:3000');
})


// clean exit the server and node process when one of these events occur
const events = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException','SIGTERM'];
for (let e of events) {
    process.on(e, () => {
        server.close(() => process.exit())
    })
}