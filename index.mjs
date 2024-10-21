import express from "express";
const app = express()
const port = 3000
import open from 'open';
import livereload from "livereload";
import connectLiveReload from "connect-livereload";


const liveReloadServer = livereload.createServer({exts:['mjs','html'], debug: true});
liveReloadServer.watch("./**");

liveReloadServer.debug = (message) => {
    if (message.indexOf("Reloading") > -1) {
        console.log(message);
    }
}

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

app.use(connectLiveReload());


app.use(express.static('public'))

const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`)
    open('http://localhost:3000');
})


// clean exit the server and node process when one of these events occur
const events = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException','SIGTERM'];
for (let e of events) {
    process.on(e, () => {
        server.close(() => process.exit())
    })
}