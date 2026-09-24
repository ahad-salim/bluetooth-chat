import { WebSocket } from "ws";

import * as readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout});
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('Connected!'); rl.prompt();
})
ws.on('message', m => {
    console.log(`\nFriend: ${m}`); rl.prompt();    
})
rl.on('line', t => {
    ws.send(t); rl.prompt();
})