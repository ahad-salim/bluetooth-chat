import bleConnection from "@siva7170/ble-connection";

const server = new bleConnection.BLEServer();

// Initialize the server
server.Initiate();

// When a client connects
server.OnClientConnected(() => {
  console.log("✅ Client connected!");
});

// When a client disconnects
server.OnClientDisconnected(() => {
  console.log("❌ Client disconnected");
});

// When data is received from the client
server.OnData((data: string) => {
  console.log("📩 Received from client:", data);

  // Reply back
  server.SendData("Hello from Server!");
});

// Start the server
server.StartServer("BluetoothChat");

console.log("🟢 Bluetooth SPP Server is running...");
console.log("Waiting for client connection...");
