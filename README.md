## 介绍

一个轻量级的 jsbridge，用于在 WebView 中的 javascript 和 flutter 之间发送消息。

## 功能

- 支持渠道设置，兼容 flutter、reactnative、iframe 等渠道，默认 flutter
- 支持查看消息日志（debug 模式）
- 支持注册方法
- 支持取消注册方法
- 支持 Flutter 和 Javascript 之间方法互相调用，传递参数、接收返回结果

## 开始

- 在`html`文件中引用`script`标签

```html

<script src="https://unpkg.com/javascript-jsbridge-sdk@latest/dist/jsbridge.umd.js"></script>
```
- 在使用window.WebViewJSBridge之前，调用setupWebViewJSBridge方法确保window.WebViewJSBridge存在
```text
var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
function setupWebViewJSBridge (callback) {
 // Android使用
 if (isAndroid) {
   if (window.WebViewJSBridge) {
     callback(WebViewJSBridge)
   } else {
     document.addEventListener(
       'WebViewJSBridgeReady',
       function () {
         callback(WebViewJSBridge)
       },
       false
     )
   }
 }

 // iOS使用
 if (isiOS) {
   if (window.WebViewJSBridge) {
     return callback(WebViewJSBridge)
   }
   if (window.WVJBCallbacks) {
     return window.WVJBCallbacks.push(callback)
   }
   window.WVJBCallbacks = [callback]
   var WVJBIframe = document.createElement('iframe')
   WVJBIframe.style.display = 'none'
   WVJBIframe.src = 'wvjbscheme://__bridge_loaded__'
   document.documentElement.appendChild(WVJBIframe)
   setTimeout(function () {
     document.documentElement.removeChild(WVJBIframe)
   }, 0)
 }
}
```

## 用法

### 初始化配置

```text
  window.WebViewJSBridge.init({debug: true, channel: 'flutter'});
```

| 参数      | 说明                                   | 默认值和类型          | 必传  |
|---------|--------------------------------------|-----------------|-----|
| debug   | 调试模式                                 | false(Boolean)  | 否   |
| channel | 渠道，支持android、ios、reactnative、flutter | flutter(String) | 否   |

### 注册方法

#### callback模式

```text
  window.WebViewJSBridge.registerHandler('JSEcho', function (data, success, fail) {
    success('success response from javascript');
    // fail('fail response from javascript');
  });
```

| 参数          | 说明                                                                                          | 默认值和类型     | 必传  |
|-------------|---------------------------------------------------------------------------------------------|------------|-----|
| handlerName | 注册的方法名称                                                                                     | (String)   | 是   |
| handler     | 注册的方法实现，没有返回值<br/>data:发送过来的数据<br/>success:js端业务处理成功时通知native端<br/>fail:js端业务处理失败时通知native端 | (Function) | 是   |

#### promise模式

```text
  window.WebViewJSBridge.registerHandler('JSEcho', async function (data) {
    // return Promise.resolve('success response from javascript');
    return 'success response from javascript';
    // return Promise.reject('fail response from javascript');
    // throw Error('fail response from javascript');
  });
```

| 参数          | 说明                                                                                                                | 默认值和类型     | 必传  |
|-------------|-------------------------------------------------------------------------------------------------------------------|------------|-----|
| handlerName | 注册的方法名称                                                                                                           | (String)   | 是   |
| handler     | 注册的方法实现，返回Promise<br/>data:发送过来的数据<br/>Promise.resolve:js端业务处理成功时通知native端<br/>Promise.reject:js端业务处理失败时通知native端 | (Function) | 是   |

### 取消注册方法

```text
  window.WebViewJSBridge.unregisterHandler('JSEcho');
```

| 参数          | 说明      | 默认值和类型    | 必传  |
|-------------|---------|-----------|-----|
| handlerName | 注册的方法名称 | (Boolean) | 是   |

### 调用方法

#### callback模式

```text
  window.WebViewJSBridge.callHandler('FlutterEcho', {
    data: 'request from javascript',
    success: function (data) {
      print('[call handler] success response: ' + data);
    },
    fail: function (err) {
      print('[call handler] fail response: ' + err);
    },
  });
```

| 参数          | 说明                                                                             | 默认值和类型   | 必传  |
|-------------|--------------------------------------------------------------------------------|----------|-----|
| handlerName | 调用的方法名称                                                                        | (String) | 是   |
| payload     | 参数对象<br/>data:发送过来的数据<br/>success:native端业务处理成功时的回调<br/>fail:native端业务处理失败时的回调 | (Object) | 是   |

#### promise模式

```text
  try {
    var data = await window.WebViewJSBridge.callHandler('FlutterEcho', {
      data: 'request from javascript',
    });
    print('[call handler] success response: ' + data);
  } catch (err) {
    print('[call handler] fail response: ' + err);
  }
```
| 参数          | 说明                                                                   | 默认值和类型    | 必传  |
|-------------|----------------------------------------------------------------------|-----------|-----|
| handlerName | 调用的方法名称                                                              | (String)  | 是   |
| payload     | 参数对象<br/>data:发送过来的数据                                                | (Object)  | 是   |
| return      | 返回Promise<br/>resolve:native端业务处理成功时的回调<br/>reject:native端业务处理失败时的回调 | (Promise) | 是   |

