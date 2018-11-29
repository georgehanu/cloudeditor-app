const defaults = {
  escapeMap: {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;",
    " ": "&nbsp;"
  }
};
const nativeKeys = Object.keys;
const _O = o => {
  return { ...defaults, ...o };
};
const createEscaper = map => {
  var escaper = match => {
      return map[match];
    },
    source = "(?:" + _keys(map).join("|") + ")",
    testRegexp = RegExp(source),
    replaceRegexp = RegExp(source, "g");
  return string => {
    string = string == null ? "" : "" + string;
    return testRegexp.test(string)
      ? string.replace(replaceRegexp, escaper)
      : string;
  };
};
const _keys = obj => {
  if (!_isObject(obj)) return [];
  if (nativeKeys) return nativeKeys(obj);
  var keys = [];
  for (var key in obj) if (_has(obj, key)) keys.push(key);
  return keys;
};
const _createEscaper = map => {
  var escaper = match => {
      return map[match];
    },
    source = "(?:" + _keys(map).join("|") + ")",
    testRegexp = RegExp(source),
    replaceRegexp = RegExp(source, "g");
  return string => {
    string = string == null ? "" : "" + string;
    return testRegexp.test(string)
      ? string.replace(replaceRegexp, escaper)
      : string;
  };
};
const _isObject = obj => {
  var type = typeof obj;
  return type === "function" || (type === "object" && !!obj);
};
const _has = (obj, key) => {
  return obj != null && hasOwnProperty.call(obj, key);
};
const _invertPrintq = obj => {
  var result = {};
  var keys = _keys(obj);
  for (var i = 0, length = keys.length; i < length; i++) {
    result[obj[keys[i]]] = keys[i];
  }
  return result;
};
const _escape = (string, o) => {
  var o = _O(o),
    escaper = _createEscaper(o.escapeMap);
  return escaper(string);
};
const _unescape = (string, o) => {
  var o = _O(o),
    escaper = _createEscaper(_invertPrintq(o.escapeMap));
  return escaper(string);
};
const _decodeEntities = str => {
  if (str && typeof str === "string") {
    var element = document.getElementById("fitTextEscaper");

    // Escape HTML before decoding for HTML Entities
    str = encodeURIComponent(str)
      .replace(/%26/g, "&")
      .replace(/%23/g, "#")
      .replace(/%3B/g, ";");

    element.innerHTML = str;
    if (element.innerText) {
      str = element.innerText;
      element.innerText = "";
    } else {
      // Firefox support
      str = element.textContent;
      element.textContent = "";
    }
  }
  return decodeURIComponent(str)
    .replace(new RegExp("\n", "g"), "")
    .replace(new RegExp("<br>$", "g"), "");
};
const pqDecodeEntities = element => {
  const text = element.innerHTML;
  return _decodeEntities(text);
};

const PrintqEscaper = {
  pqDecodeEntities
};

module.exports = PrintqEscaper;
