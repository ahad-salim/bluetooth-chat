import { Bluetooth } from "webbluetooth";

async function testBluetooth() {
  try {
    const bluetooth = new Bluetooth();

    const available = await bluetooth.getAvailability();

    console.log("Bluetooth available:", available);

    if (!available) {
      console.log("Bluetooth is not available.");
      return;
    }

    console.log("Requesting a Bluetooth device...");

    const device = await bluetooth.requestDevice({
      acceptAllDevices: true,
    });

    console.log("Device found:", device.name);
    console.log("Device ID:", device.id);
  } catch (error) {
    console.error("Bluetooth test failed:", error);
  }
}

testBluetooth();
