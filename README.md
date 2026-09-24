# Bluetooth Chat Report

## Executive Summary

Direct PC-to-PC Bluetooth communication from a web browser is not possible using the Web Bluetooth API. The API only supports the Central (client) role, meaning a browser can connect to a BLE peripheral but cannot advertise itself as one. Several Node.js libraries attempt to fill this gap, but each comes with significant platform limitations. This report evaluates four approaches: 
- Web Bluetooth, 
- bluetooth-serial-port, 
- bleno/noble (Node.js BLE stack), 
- and the Web Serial API.

### Bottom line: For two Windows PCs, none of the browser-based BLE options work directly. The most practical paths are 
1. a hardware bridge (ESP32/Arduino) with Web Bluetooth, or 
2. the Web Serial API (Chrome 117+) with pre-paired Bluetooth Classic devices. 
The Node.js route (bleno + noble) is technically possible on Windows but requires sacrificing dedicated USB dongles and replacing their drivers with WinUSB.

## Comparison Table

Approach Role Supported Two Windows PCs? Browser-Based? Status
- Web Bluetooth API Central only ❌ No ✅ Yes Active standard
- bluetooth-serial-port Server (Linux only) + Client ❌ No (server unavailable) ❌ Node.js only Deprecated
- bleno + noble Peripheral + Central ⚠️ Technically yes, impractical ❌ Node.js only Forks maintained
- Web Serial API (Bluetooth Classic) Serial client ✅ Yes (pre-paired) ✅ Yes Active (Chrome 117+)

1. Web Bluetooth API

Can it work for PC-to-PC? No.

The Web Bluetooth specification explicitly limits browser behavior to the Central role: "The first version of this specification allows web pages, running on a UA in the Central role, to connect to GATT Servers". A device in the Central role can connect to Peripherals, but a browser cannot advertise itself or act as a Peripheral (GATT server). Since both PCs running a browser would be Centrals, neither can accept a connection from the other.

Requirements (if using a hardware bridge):

· A BLE peripheral device (e.g., ESP32, Arduino Nano 33 IoT) acting as the GATT server.
· Chromium-based browser (Chrome, Edge) on both PCs.
· The bridge relays data between the two browser clients.

Platform support: Chrome 56+, Edge 79+, Opera 43+. Works on desktop and Android. Peripheral role is not planned for the Web Bluetooth API.

2. bluetooth-serial-port (Node.js)

Can it work for PC-to-PC? No, not on Windows.

This package provides RFCOMM/SPP communication for Node.js. It has both a client and a server component, but the server is "experimental RFCOMM server socket (Linux only)". The package documentation explicitly states it is "Not available (yet) for Windows and Mac OS X" for full functionality.

Critical limitations:

· Deprecated: The maintainer states "Currently I have no plans to add support for nodejs version 1.13 and up".
· macOS support dropped as of v3.0.0.
· Windows can only be a client, not a server.
· Server on Linux requires modifying the Bluetooth service config to add the --compat flag.

Windows prerequisites (client only): Visual Studio (Visual C++) and Python 2.x.

Verdict: Not suitable for two Windows PCs. The server role — required for one PC to listen for connections — does not exist on Windows.

3. bleno + noble (Node.js BLE Stack)

Can it work for PC-to-PC? Technically yes, but impractical on Windows.

This is the correct Node.js approach for BLE PC-to-PC communication: one PC runs bleno (Peripheral/server) and the other runs noble (Central/client). Both are Node.js-only, not browser-based.

bleno (Peripheral Role)

Windows requirements:

· A compatible Bluetooth 4.0 USB adapter.
· WinUSB driver replacement using the Zadig tool. This makes the dongle unusable for normal Windows Bluetooth (headsets, mice, etc.).
· Visual Studio and Python 2.7 for node-gyp compilation.

Important: The original bleno is unmaintained. Use the fork @stoprocent/bleno. Its documentation notes that the default Windows binding uses the native WinRT GATT server and the normal Windows Bluetooth driver, which may avoid the WinUSB replacement — but the adapter must still support the BLE peripheral role. Building from source still requires Python and Visual Studio C++.

noble (Central Role)

Windows support: Use @stoprocent/noble, which has "overhauled Windows native bindings" with support for Service Data from advertisements. It can use native Windows bindings (withBindings('win')) or HCI bindings with a USB dongle.

Critical constraint: Running both noble and bleno together only works with macOS bindings or separate HCI/UART dongles. On Windows, you would need one dedicated dongle per role (or run each on a separate PC, which is the intended use case).

Verdict

Aspect Assessment
Browser-based? ❌ No — Node.js only
Two Windows PCs? ⚠️ Possible but each PC needs a dedicated adapter with driver replacement
Reliability Poor — pairing and connection issues commonly reported
Practicality Low — significant hardware and driver tinkering required

4. Web Serial API (Bluetooth Classic RFCOMM)

Can it work for PC-to-PC? Yes, with pre-paired devices.

Since Chrome 117 on desktop, the Web Serial API supports communication with RFCOMM services on paired Bluetooth Classic devices, including the Serial Port Profile (SPP). This is the only browser-based method that can enable PC-to-PC communication without a hardware bridge.

How it works:

1. Both PCs must be paired at the OS level via Bluetooth Classic (not BLE).
2. Your web page calls navigator.serial.requestPort() to access the paired device's serial port.
3. Data is exchanged over the RFCOMM serial connection.

Chrome 130+ improvement: Web apps can now detect when a Bluetooth RFCOMM serial port is available without opening it first.

Requirements:

· Chrome 117+ on desktop (Windows, macOS, Linux).
· Both PCs paired via Bluetooth Classic in OS settings.
· No hardware bridge needed.

Limitations:

· Bluetooth Classic only (not BLE).
· Both devices must be pre-paired in the OS.
· Chromium-based browsers only.

Recommendation

Your Goal Recommended Approach
Browser-based, no extra hardware Web Serial API (Chrome 117+) with Bluetooth Classic pairing
Browser-based, BLE required Hardware bridge (ESP32/Arduino) + Web Bluetooth on both PCs
Node.js, willing to sacrifice dongles @stoprocent/bleno + @stoprocent/noble with dedicated WinUSB adapters
Avoid bluetooth-serial-port (deprecated, no Windows server)

For most users, the Web Serial API is the simplest browser-based path for PC-to-PC Bluetooth communication on Windows. If BLE is a hard requirement, the hardware bridge approach is far more reliable than fighting Windows driver constraints with bleno and noble.