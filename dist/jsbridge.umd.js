!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";window.WebViewJSBridge||(window.WebViewJSBridge=new function(){var e={},t={},n={},i=0,o=!1,r=["flutter"];function a(){if(o){var e=Array.prototype.slice.call(arguments);console.log.apply(null,e)}}function c(){return r.indexOf("iframe")>-1}function d(t,n){e[t]=n}function s(e,o){return function(e,o){if(!e)throw Error("WebViewJSBridge: handler name can not be null!!!");var r={id:i++,type:"request",resolved:!1,rejected:!1};if(r.action=e,o&&(o.data&&(r.data=o.data),o.success&&(t[r.id]||(t[r.id]={}),t[r.id].success=o.success),o.fail&&(t[r.id]||(t[r.id]={}),t[r.id].fail=o.fail)),f(r),!t[r.id]&&/native code/.test(Promise.toString())&&"undefined"!=typeof Promise)return new Promise(((e,t)=>n[r.id]={resolve:e,reject:t}))}(e,o)}function u(i){var o=decodeURIComponent(i),r=JSON.parse(o);a("[WebViewJSBridge receiveMessage]: ",r);var c=r;"request"===c.type&&function(t){function n(e){l(t={action:t.action,data:e,id:t.id,type:"response",resolved:!0,rejected:!1})}function i(e){l(t={action:t.action,data:e,id:t.id,type:"response",resolved:!1,rejected:!0})}var o=t.action;if(o in e){var r=(0,e[o])(t.data,(function(e){n(e)}),(function(e){i(e)}));"[object Promise]"==Object.prototype.toString.call(r)&&r.then((function(e){n(e)})).catch((function(e){i(e.toString())}))}else i(`handler name -> ${o} can't find!!!`)}(c),"response"===c.type&&function(e){var i=e.id,o=e.data,r=e.resolved,a=e.rejected;t[i]&&(r&&t[i].success&&t[i].success(o),a&&t[i].fail&&t[i].fail(o),delete t[i]),n[i]&&(r&&n[i].resolve(o),a&&n[i].reject(o),delete n[i])}(c)}function f(e){a("[WebViewJSBridge postMessage]: ",e);var t=JSON.stringify(e),n=encodeURIComponent(t);c()&&self!=top&&window.parent.postMessage(n,"*"),r.indexOf("flutter")>-1&&window.FlutterWebView&&window.FlutterWebView.postMessage(n),r.indexOf("reactnative")>-1&&window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(n)}function l(e){f(e)}return{init:function(e){e&&(e.debug&&(o=!!e.debug),e.channel&&"[object Array]"===Object.prototype.toString.apply(e.channel)&&(r=e.channel,c()&&window.addEventListener("message",(e=>{window.eval(e.data)})))),d("#evalJavaScript#",(function(e,t,n){try{t(Function('"use strict";return ('+e.toString()+")")())}catch(e){a(e),n(e.toSring())}})),s("#jsbridgeReady#",{data:!0,success:function(e){a("[#jsbridgeReady#] success response: "+e)},fail:function(e){a("[#jsbridgeReady#] fail response: "+e)}})},registerHandler:d,unregisterHandler:function(t){e[t]&&delete e[t]},callHandler:s,onMessageReceived:function(e){setTimeout((function(){u(e)}),0)}}},setTimeout((()=>{var e=document,t=e.createEvent("Event"),n=window.WVJBCallbacks||[];t.initEvent("WebViewJSBridgeReady",!0,!1),t.bridge=WebViewJSBridge,delete window.WVJBCallbacks;for(var i=0;i<n.length;i++)(0,n[i])(WebViewJSBridge);e.dispatchEvent(t)}),0))}));
