import { WebSocketServer } from 'ws';
import { BluetoothSerialPortServer } from 'bluetooth-serial-port';
import * as readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// --- SETUP ---
const wss = new WebSocketServer({ port: 8080 });
const btServer = new BluetoothSerialPortServer();

let wsClient = null;
let btClient = null;

console.log("🔵 HUB STARTED");
console.log(" - WS (Online/Hotspot) at ws://0.0.0.0:8080");
console.log(" - BT (Offline) at channel 1");

// --- WEBSOCKET (ONLINE) ---
wss.on('connection', ws => {
  console.log("✅ PC2 connected via WS (Online)");
  wsClient = ws;
  ws.on('message', m => {
    console.log(`\n[WS] PC2: ${m}`);
    rl.prompt();
  });
});

// --- BLUETOOTH (OFFLINE) ---
btServer.listen(
  addr => {
    console.log(`✅ PC2 connected via Bluetooth (Offline) from ${addr}`);
    btClient = btServer;
    btServer.on('data', b => {
      console.log(`\n[BT] PC2: ${b.toString()}`);
      rl.prompt();
    });
  },
  err => console.error("BT Error:", err),
  { uuid: '1101', channel: 1 }
);

// --- TYPING FROM PC1 ---
rl.prompt();
rl.on('line', text => {
  // Send to whatever is connected
  if (wsClient?.readyState === 1) {
    wsClient.send(text);
    console.log(`(sent via WS)`);
  }
  if (btClient) {
    btClient.write(Buffer.from(text, 'utf-8'));
    console.log(`(sent via BT)`);
  }
  if (!wsClient && !btClient) console.log("PC2 not connected yet");
  rl.prompt();
});