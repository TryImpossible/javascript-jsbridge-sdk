(function () {
  if (window.javascriptJSBridgeChannel) {
    return;
  }

  var jsBridge = {
    // 方法集合
    handlers: {},
    // 回调集合
    callbacks: {},
    promises: {},
    id: 0,
    debug: false,

    registerHandler: _registerHandler,
    unregisterHandler: _unregisterHandler,
    callHandler: _callHandler,
    onMessageReceived: function (messageString) {
      setTimeout(function () {
        _onMessageReceived(messageString);
      }, 0);
    },
  };

  function _log() {
    if (jsBridge.debug) {
      var args = Array.prototype.slice.call(arguments)
      console.log.apply(null, args);
    }
  }

  // 注册方法
  function _registerHandler(handlerName, handler) {
    jsBridge.handlers[handlerName] = handler;
  }

  // 注销方法
  function _unregisterHandler(handlerName) {
    if (!jsBridge.handlers[handlerName]) {
      return;
    }
    delete jsBridge.handlers[handlerName];
  }

  // 调用方法
  // const {data, success, fail} = payload
  function _callHandler(handlerName, payload) {
    return _receiverCall(handlerName, payload);
  }

  // 监听jsbridge消息
  function _onMessageReceived(messageString) {
    var decodeString = decodeURIComponent(messageString);
    var jsonData = JSON.parse(decodeString);
    _log('[javascriptJSBridgeChannel receiveMessage]: ', jsonData);
    var message = jsonData;

    if (message.type === 'request') {
      _senderCall(message);
    }
    if (message.type === 'response') {
      _receiverCallResponse(message);
    }
  }

  // 发送jsbridge消息
  function _postMessage(jsonData) {
    _log('[javascriptJSBridgeChannel postMessage]: ', jsonData);
    var jsonString = JSON.stringify(jsonData);
    var encodeString = encodeURIComponent(jsonString);
    if (self != top) {
      // iframe load current page
      window.parent.postMessage(encodeString, '*');
    } else {
      window.FlutterJSBridgeChannel && window.FlutterJSBridgeChannel.postMessage(encodeString);
    }
  }

  // 接收者调用方法
  function _receiverCall(handlerName, payload) {
    if (!handlerName) {
      throw Error('javascriptJSBridgeChannel: handler name can not be null!!!');
    }

    var message = {
      id: jsBridge.id++,
      type: 'request',
      resolved: false,
      rejected: false,
    };
    message.action = handlerName;
    if (payload) {
      if (payload.data) {
        message.data = payload.data;
      }

      if (!jsBridge.callbacks[message.id]) {
        jsBridge.callbacks[message.id] = {};
      }
      if (payload.success) {
        jsBridge.callbacks[message.id].success = payload.success;
      }
      if (payload.fail) {
        jsBridge.callbacks[message.id].fail = payload.fail;
      }
    }

    _postMessage(message);

    if (/native code/.test(Promise.toString()) && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => jsBridge.promises[message.id] = { resolve, reject }).catch(function(_){});
    }
  }

  // 接收者调用方法的回调
  function _receiverCallResponse(message) {
    var id = message.id;
    var data = message.data;
    var isResolved = message.resolved;
    var isRejected = message.rejected;

    if (jsBridge.callbacks[id]) {
      if (isResolved) {
        jsBridge.callbacks[id].success && jsBridge.callbacks[id].success(data);
      }
      if (isRejected) {
        jsBridge.callbacks[id].fail && jsBridge.callbacks[id].fail(data);
      }
      delete jsBridge.callbacks[id];
    }
    if (jsBridge.promises[id]) {
      if (isResolved) {
        jsBridge.promises[id].resolve(data);
      }
      if (isRejected) {
        jsBridge.promises[id].reject(data);
      }
      delete jsBridge.promises[id];
    }
  }

  // 发送者调用方法
  function _senderCall(message) {
    // 成功的回调
    function _successResponse(data) {
      message = {
        action: message.action,
        data: data,
        id: message.id,
        type: 'response',
        resolved: true,
        rejected: false,
      };
      _senderCallResponse(message);
    }

    // 失败的回调
    function _failResponse(err) {
      message = {
        action: message.action,
        data: err,
        id: message.id,
        type: 'response',
        resolved: false,
        rejected: true,
      };
      _senderCallResponse(message);
    }

    var handlerName = message.action;
    if (handlerName in jsBridge.handlers) {
      var handler = jsBridge.handlers[handlerName];
      var promise = handler(message.data, function (data) {
        _successResponse(data);
      }, function (err) {
        _failResponse(err);
      });
      if (Object.prototype.toString.call(promise) == '[object Promise]') {
        promise.then(function (data) {
          _successResponse(data);
        }, function (err) {
          _failResponse(err.toString);
        });
      }
    } else {
      _failResponse(`handler name -> ${handlerName} can't find!!!`);
    }
  }

  // 发送者调用方法的回调
  function _senderCallResponse(message) {
    _postMessage(message);
  }

  window.javascriptJSBridgeChannel = {
    set debug(isDebug) {
      jsBridge.debug = isDebug;
    },
    registerHandler: jsBridge.registerHandler,
    unregisterHandler: jsBridge.unregisterHandler,
    callHandler: jsBridge.callHandler,
    onMessageReceived: jsBridge.onMessageReceived,
  };

  setTimeout(() => {
    var doc = document;
    var readyEvent = doc.createEvent('Events');
    var jobs = window.WVJBCallbacks || [];
    readyEvent.initEvent('javascriptJSBridgeChannelReady');
    readyEvent.bridge = javascriptJSBridgeChannel;
    delete window.WVJBCallbacks;
    for (var i = 0; i < jobs.length; i++) {
      var job = jobs[i];
      job(javascriptJSBridgeChannel);
    }
    doc.dispatchEvent(readyEvent);
  }, 0);

  window.addEventListener('message', (event) => {
    window.eval(event.data);
    // window.javascriptJSBridgeChannel.onMessageReceived(event.data);
  });
})();