import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 8080});
console.log('Server: ws://localhost:8080');

wss.on('connection', ws => {
    ws.on('message', msg => {
        wss.clients.forEach(c => {
            if(c.readyState === 1) c.send(msg.toString());
        });
    });
});