import { BluetoothSerialPort } from "bluetooth-serial-port";

const bluetooth = new BluetoothSerialPort();

console.log("Bluetooth test started...");
console.log("Scanning for Bluetooth devices...");

bluetooth.inquire();

bluetooth.on("found", (address: string, name: string) => {
    console.log("Device found!");
    console.log("Name:", name);
    console.log("Address:", address);
});

bluetooth.on("finished", () => {
    console.log("Bluetooth scan finished.");
});

bluetooth.on("failure", (error: Error) => {
    console.error("Bluetooth error:", error);
});