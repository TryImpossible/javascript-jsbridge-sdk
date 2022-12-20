export type JSBridgeHandler<T extends Object> = (data: any) => Promise<T>;

export type JavascriptRunner = (javascriptString: String) => Promise<void>;

export type JSBridgeMessageHandler = (javascriptString: String) => void;

