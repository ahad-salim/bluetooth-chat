import { bluetooth } from "webbluetooth";

async function connectToDevice() {
  try {
    console.log("Searching for Bluetooth devices...");

    // 1. Scan for any device (acceptAllDevices)
    // If you know the service UUID, replace acceptAllDevices with: filters: [{ services: ['your-uuid'] }]
    const device = await bluetooth.requestDevice({
      acceptAllDevices: true,
    });

    console.log(
      `\nFound device! Name: ${device.name || "Unknown"}, ID: ${device.id}`,
    );

    // 2. Connect to the GATT Server
    console.log("Connecting to device GATT server...");
    const server = await device.gatt.connect();
    console.log("Connected successfully!");

    // 3. Optional: List primary services
    console.log("Discovering primary services...");
    const services = await server.getPrimaryServices();
    console.log(`Discovered ${services.length} services.`);

    // Keep the connection alive or disconnect when done
    // await device.gatt.disconnect();
  } catch (error) {
    console.error("Bluetooth Error:", error);
  }
}

connectToDevice();
