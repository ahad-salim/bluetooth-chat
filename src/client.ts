import { BluetoothSerialPort } from "bluetooth-serial-port";

const btSerial = new BluetoothSerialPort();
const PC2_ADDRESS = "58:91:CF:E2:C2:E5";

console.log("Looking for RFCOMM serial service...");

btSerial.findSerialPortChannel(
  PC2_ADDRESS,
  (channel) => {
    console.log("RFCOMM channel found:", channel);

    btSerial.connect(
      PC2_ADDRESS,
      channel,
      () => {
        console.log("✅ Connected!");

        btSerial.write(Buffer.from("Hello from PC 1!", "utf-8"), (err) => {
          if (err) console.error("Send failed:", err);
          else console.log("Message sent!");
        });

        btSerial.on("data", (buffer: Buffer) => {
          console.log("📩 Received:", buffer.toString("utf-8"));
        });
      },
      (err) => console.error("Connection failed:", err),
    );
  },
  () => console.error("❌ Still no RFCOMM service found"),
);
