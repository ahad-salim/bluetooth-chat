import { BluetoothSerialPortServer } from "bluetooth-serial-port";

const server = new BluetoothSerialPortServer();

server.listen(
  (clientAddress) => {
    console.log("✅ Client connected from:", clientAddress);

    server.on("data", (buffer: Buffer) => {
      console.log("📩 Received:", buffer.toString("utf-8"));

      // Optional: reply
      server.write(Buffer.from("Hello back from CLANSMAN!", "utf-8"), (err) => {
        if (err) console.error("Write error:", err);
      });
    });
  },
  (error) => {
    console.error("Server error:", error);
  },
  { uuid: "1101", channel: 1 } // Standard Serial Port UUID
);

console.log("🟢 Bluetooth SPP Server is listening...");