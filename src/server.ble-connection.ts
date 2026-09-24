import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bleConnection = require('@siva7170/ble-connection');

const server = new bleConnection.BLEServer();
const SERVICE_NAME = 'MyBluetoothChat';

server.Initiate();
console.log('Server initiated.');

server.StartServer(SERVICE_NAME);
console.log(`Server started: "${SERVICE_NAME}"`);

server.OnClientConnected(() => {
  console.log('Client connected!');
});

server.OnData((data: string) => {
  console.log('Received:', data);
  server.SendData('pong');
  console.log('Sent: pong');
});

server.OnClientDisconnected(() => {
  console.log('Client disconnected.');
});

process.on('SIGINT', () => {
  server.StopServer();
  process.exit();
});