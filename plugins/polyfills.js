Date.prototype.backendStamp = function () {
  return Math.floor(this.getTime() / 1000)
}
const Decimal = require("decimal.js").default;

String.prototype.setDigit = function (digit) {
  const str = this;
  const parts = str.split(".");
  if (parts[1] && parts[1].length > digit) {
    return parts[0] + (digit > 0 ? "." : "") + parts[1].substr(0, digit);
  }
  return str;
};

String.prototype.limitDigit = function (limit, defDigit = 8) {
  const str = (this || "").toString().trim();
  const digit = str.obtainMaxDigit(limit, defDigit);
  return str.setDigit(digit);
};

String.prototype.obtainMaxDigit = function (limit, defDigit = 8, array, keyFn) {
  array = array || [(this || "")];
  keyFn = keyFn || function (number) {
    return number;
  };

  let result = defDigit;
  let max = "0";
  let extra = 0;
  const len = array.length;
  for (let i = 0; i < len; i++) {
    const item = array[i];
    const temp = (keyFn(item) + "").trim();
    const num = temp.replace(/,/g, "");
    if (!isNaN(num)) {
      if (max.decimalCmp(num) === -1) {
        max = num;
        extra = temp.length - num.length;
      }
    }
  }
  max = max.toLowerCase().scientificToDecimal();
  const parts = max.split(".");

  const maxLenDist = (parts[0].length + extra) + 1 + defDigit;
  const offset = maxLenDist - limit;
  if (offset <= 0) { // 可以满足
    return defDigit;
  }
  result = defDigit - offset;
  return result >= 0 ? result : 0;
};

String.prototype.scientificToDecimal = function () {
  let num = (this || "0").toLowerCase();
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    let prefix = "";
    if (num[0] === "-") {
      prefix = "-";
      num = num.substring(1);
    }
    const zero = "0";
    const parts = num.split("e");
    const e = parts.pop();
    let l = Math.abs(e);
    const sign = e / l;
    const coeffArray = parts[0].split(".");
    if (sign === -1) {
      num =
        prefix + zero + "." + new Array(l).join(zero) + coeffArray.join("");
    } else {
      const dec = coeffArray[1];
      if (dec) {
        l = l - dec.length;
      }
      num = prefix + coeffArray.join("") + new Array(l + 1).join(zero);
    }
  }
  return num;
};
String.prototype.simplify = function (length = 5, str = "...") {
  if (this.length <= length || length <= 0) {
    return this;
  }
  return this.substr(0, length) + str;
};
String.prototype.formatCurrency = function (digit = 10,
  charDec = ".",
  charSep = ",") {
  let n = this || "0";
  let prefix = "";
  if (n[0] === "-") {
    prefix = "-";
    n = n.substring(1);
  }
  n = n.scientificToDecimal();

  const decimalArray = n.toString().split(".");
  decimalArray[0] = decimalArray[0] || "";
  decimalArray[1] = decimalArray[1] || "";

  const integerLen = decimalArray[0].length;
  const paddingZeroCount =
    digit - ((integerLen > 0 ? integerLen : 1) + decimalArray[1].length) - 1;
  let integerString = "";
  for (let i = decimalArray[0].length - 1; i >= 0; i--) {
    if ((decimalArray[0].length - i) % 3 === 0 && i > 0) {
      // 加逗号
      integerString = charSep + decimalArray[0][i] + integerString;
    } else {
      integerString = decimalArray[0][i] + integerString;
    }
  }
  if (integerString === "") {
    integerString = "0";
  }

  let decimalString = decimalArray[1];
  if (paddingZeroCount > 0) {
    // 补0
    for (let i = 0; i < paddingZeroCount; i++) {
      decimalString += "0";
    }
  } else if (paddingZeroCount < 0) {
    // 去掉0
    decimalString = decimalString.substring(
      0,
      decimalString.length + paddingZeroCount
    );
  }
  return decimalString === ""
    ? prefix + integerString
    : prefix + integerString + charDec + decimalString;
};

Number.prototype.formatMoney = String.prototype.formatMoney = function (c = 0, charDec = '.', charSep = ',', noZero = true, lang) {
  let n = String(this || "0");
  let prefix = "";
  if (n[0] === "-" || n[0] === '+') {
    prefix = n[0];
    n = n.substring(1);
  }
  let rounded = `${n}`.round(c);
  rounded = rounded.scientificToDecimal();
  let postfix = "";

  if (lang) {
    let integer = parseInt(rounded, 10).toString();
    if (/zh/i.test(lang)) {
      if (integer * 1 >= 1000000) {
        postfix = "万";
        integer = integer.substring(0, integer.length - 2);
        integer = (integer / 100).toString();
      }
    } else {
      if (integer * 1 >= 1000000000) {
        postfix = "billion";
        integer = integer.substring(0, integer.length - 7);
        integer = (integer / 100).toString();
      } else if (integer * 1 >= 1000000 && integer * 1 < 1000000000) {
        postfix = "million";
        integer = integer.substring(0, integer.length - 4);
        integer = (integer / 100).toString();
      }
    }
    if (postfix) {
      rounded = integer;
    }
  }
}
// 小数位数
String.prototype.round = function (c) {
  const n = ((this || "0").toString() || "0").trim();
  let m = 1;
  for (let i = 0; i < c; i++) {
    m = m * 10;
  }
  return Decimal(n.toString())
    .times(m)
    .floor()
    .div(new Decimal(m.toString()))
    .toString();
};