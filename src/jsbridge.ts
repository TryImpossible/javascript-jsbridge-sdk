class JSBridge {
  _handlers: Object = {};
}

/// 定义一个top-level（全局）变量，页面引入该文件后可以直接使用jsBridge
const jsBridge: JSBridge = new JSBridge();