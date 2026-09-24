import { WebSocket } from 'ws';
import { BluetoothSerialPort } from 'bluetooth-serial-port';
import * as readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const PC1_IP = '192.168.43.15'; // <-- PUT PC1 HOTSPOT IP
const PC1_MAC = 'XX:XX:XX:XX:XX:XX'; // <-- PUT PC1 BLUETOOTH MAC

let conn = null;
let mode = '';

function startChat() {
  rl.prompt();
  rl.on('line', text => {
    if (mode === 'WS') conn.send(text);
    else conn.write(Buffer.from(text, 'utf-8'));
    rl.prompt();
  });
}

function connectBT() {
  console.log("Trying OFFLINE (Bluetooth)...");
  const bt = new BluetoothSerialPort();
  bt.connect(PC1_MAC, 1, () => {
    console.log("✅ OFFLINE via Bluetooth");
    mode = 'BT'; conn = bt;
    bt.on('data', b => {
      console.log(`\nPC1 [BT]: ${b.toString()}`);
      rl.prompt();
    });
    startChat();
  }, e => console.log("BT failed:", e));
}

console.log("Trying ONLINE (WS Hotspot)...");
const ws = new WebSocket(`ws://${PC1_IP}:8080`);

ws.on('open', () => {
  console.log("✅ ONLINE via Hotspot WS");
  mode = 'WS'; conn = ws;
  ws.on('message', m => {
    console.log(`\nPC1 [WS]: ${m}`);
    rl.prompt();
  });
  startChat();
});

ws.on('error', () => {
  console.log("WS failed, falling back to Bluetooth...");
  connectBT();
});