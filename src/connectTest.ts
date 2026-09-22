import { BluetoothSerialPort } from "bluetooth-serial-port";

const btSerial = new BluetoothSerialPort();

const PC2_ADDRESS = "58:91:CF:E2:C2:E5";

console.log("Looking for RFCOMM serial service on CLANSMAN...");

btSerial.findSerialPortChannel(
  PC2_ADDRESS,
  (channel) => {
    console.log("RFCOMM channel found:", channel);
    console.log("Connecting to CLANSMAN...");

    btSerial.connect(
      PC2_ADDRESS,
      channel,
      () => {
        console.log("✅ Bluetooth connection established!");

        btSerial.write(Buffer.from("Hello from PC 1!", "utf-8"), (error) => {
          if (error) {
            console.error("Send failed:", error);
            return;
          }

          console.log("Message sent!");
        });

        btSerial.on("data", (buffer: Buffer) => {
          console.log("📩 Message received:", buffer.toString("utf-8"));
        });
      },
      (error) => {
        console.error("❌ Connection failed:", error);
      },
    );
  },
  () => {
    console.error("❌ No RFCOMM Serial Port service found on CLANSMAN.");
  },
);
