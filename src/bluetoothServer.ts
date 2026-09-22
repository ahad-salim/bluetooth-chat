import bleConnection from "@siva7170/ble-connection";

const server = new bleConnection.BLEServer();

console.log("Starting Bluetooth SPP server...");

try {
  server.Initiate();

  server.OnClientConnected(() => {
    console.log("✅ PC 1 connected!");
  });

  server.OnClientDisconnected(() => {
    console.log("❌ PC 1 disconnected.");
  });

  server.OnData((data: string) => {
    console.log("📩 Message received:", data);

    // Reply to PC 1
    server.SendData("Hello from PC 2!");
    console.log("📤 Reply sent.");
  });

  server.StartServer("SyntaxSultanChat");

  console.log("🟢 Bluetooth SPP server is running.");
  console.log("Waiting for PC 1...");
} catch (error) {
  console.error("❌ Server error:", error);
}
