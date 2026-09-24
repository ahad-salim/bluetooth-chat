declare module "@siva7170/ble-connection" {
  export class BLEConnection {
    Initiate(successCallback: () => void, failureCallback: () => void): void;
    Connect(
      bluetoothAddr: string,
      uuid: string,
      successCallback: () => void,
      failureCallback: () => void,
    ): void;
    SendData(
      data: string,
      successCallback?: (res: any) => void,
      failureCallback?: (err: any) => void,
    ): void;
    OnReceiveData(callback: (data: string) => void): void;
    IsConnected(successCallback: () => void, failureCallback: () => void): void;
  }

  export class BLEServer {
    Initiate(): void;
    StartServer(serviceName: string): void;
    OnClientConnected(callback: () => void): void;
    OnClientDisconnected(callback: () => void): void;
    OnData(callback: (data: string) => void): void;
    SendData(data: string): void;
    StopServer(): void;
  }
}
