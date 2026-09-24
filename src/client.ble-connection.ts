import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bleConnection = require('@siva7170/ble-connection');

const client = new bleConnection.BLEConnection();

const SERVER_ADDR = '00:00:00:00:00:E0';   // Replace with PC A's MAC
const SERVER_UUID = 'aaaaaaaa-aaaa-4444-cccc-999888999888'; // Replace with the service UUID

client.Initiate(() => {
  console.log('Client initiated.');

  client.Connect(SERVER_ADDR, SERVER_UUID, () => {
    console.log('Connected to server!');

    client.SendData('ping', () => {
      console.log('Sent: ping');
    }, (err: any) => {
      console.error('Send failed:', err);
    });

    client.OnReceiveData((data: string) => {
      console.log('Received:', data);
    });

  }, () => {
    console.log('Connection failed.');
  });
}, () => {
  console.log('Init failed.');
});