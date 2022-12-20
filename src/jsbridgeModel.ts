import { JSBridgeMessageHandler } from './jsbridgeTypes'

export interface JSBridgeChannel {
  name: String;
  onMessageReceived: JSBridgeMessageHandler;
}
