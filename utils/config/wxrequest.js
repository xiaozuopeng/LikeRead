import { GLOBAL_BASE } from './config.js';
import { myStore } from '../tools/store';

var deepCopy = function (o) {
  if (o instanceof Array) {
    var n = [];
    for (var i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i]);
    }
    return n;

  } else if (o instanceof Object) {
    var n = {}
    for (var i in o) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else {
    return o;
  }
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};


function isObject(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
}

function sendRrquest(url, method, data, header) {
  let promise = new Promise(function (resolve, reject) {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.showToast({
      title: "loading",
      icon: "loading"
    });
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header,
      success: resolve,
      fail: reject,
      complete: function () {
        // complete
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();      //停止下拉刷新
      }
    })
  });
  return promise;
};


function extend(obj) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isObject(obj) && args.length > 0) {
    if (Object.assign) {
      return Object.assign.apply(Object, [obj].concat(args));
    }

    args.forEach(function (arg) {
      if (isObject(arg)) {
        Object.keys(arg).forEach(function (key) {
          obj[key] = arg[key];
        });
      }
    });
  }

  return obj;
}


function MyHttp(defaultParams, method, url, host) {

  let _build_url = GLOBAL_BASE;
  if (host) {
    _build_url = host
  }

  let _params_data = extend({}, defaultParams);
  return sendRrquest(_build_url + url, method, _params_data, {
    'content-type': 'application/x-www-form-urlencoded'
  });
}

export default MyHttp;