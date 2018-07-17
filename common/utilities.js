import {coinNames, loginURL} from "./constants";
import cookies from "../plugins/cookies";
import {locations} from "./locations";
import chineseConverter from './chineseConverter';

export const getFormattedLang = (lang) => {
  let formattedLang = "en_US";
  if (/cn/i.test(lang)) {
    formattedLang = "zh_Hans_CN"
  } else if (/hk|tw/i.test(lang)) {
    formattedLang = "zh_Hant_HK"
  }
  return formattedLang;
};

export const timeToLocale = (timestamp, showOnlyDay) => {
  if (!timestamp) {
    return "NA";
  }
  if (timestamp.indexOf('Z') < 0 && timestamp.indexOf('+') < 0 && timestamp.indexOf('-') < 0) {
    timestamp += 'Z';
  }
  const time = new Date(timestamp)
  return time.toLocaleString('chinese', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: showOnlyDay ? undefined : '2-digit',
    minute: showOnlyDay ? undefined : '2-digit',
    hour12: false,
  })
};

export const itemText=(name,options)=>{
  const item = options.find(r => r.name === name)
  return item ? (item.text) : '--'
}

export const timeToDateString = (time, withoutDay) => {
  return time.getFullYear() + '-' + (time.getMonth() + 1) + (withoutDay ? '' : ('-' + time.getDate()));
};

export const getApproxCny = (price, price_type) => {
  return parseInt(price) * (parseInt(price_type) === 2 ? 6.5 : 1)
};

export const mapCoinType = (coinTypes) => {
  return coinTypes.map(c => coinNames[c]).join(', ');
};

export const getItemStatusOfIndex = (index, list) => {
  if (index !== undefined && index < list.length - 1) {
    return list[index + 1]
  } else {
    return '其他';
  }
};

export const is_2fa = (bool) => {
  return bool ? "已设置" : " -- ";
};

export const areaStackChartOption = (data, props) => {
  let xAxisData = [];
  let legends = [];
  let seriesData = props.yAxisLines.map(line => {
    legends.push(line.label);
    return {
      type: 'line',
      stack: '总量',
      areaStyle: {normal: {}},
      data: [],
      name: line.label,
    };
  });

  data.forEach(item => {
    const xAxisValue = item[props.xAxis.prop];
    xAxisData.push(props.xAxis.formatter ? props.xAxis.formatter(null, null, xAxisValue) : xAxisValue);
    props.yAxisLines.map((line, index) => {
      seriesData[index].data.push(item[line.prop]);
    });
  });

  return {
    title: {
      text: props.title || '堆叠区域图',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: legends,
      top: '5%',
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '1%',
      top: '12%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: seriesData,
  }
};

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const checkAuth = (axios, store) => {
  if (cookies.getItem(window.document, 'token')) {
    // has token try verifying login and authorization
    store.commit('checkAuth', true);
    const testWithoutVerification = true;
    if (testWithoutVerification) {
      store.commit('checkAuth', false);
      store.commit('sign', true);
      store.commit('authorize', true);
      return;
    }
    return axios.get('verification').then(response => {
      // 错误情况已经在axios统一处理
      store.commit('checkAuth', false);
      store.commit('sign', true);
      store.commit('authorize', true);
    }).catch(e => {
      store.commit('checkAuth', false);
      console.log(e.response)
      if (e.response && e.response.status === 404) {
        window.location.href = window.location.hostname + '/forbidden';
      } else {
        window.location.href = loginURL;
      }
    });
  } else {
    window.location.href = loginURL;
  }
};

export const getAddressByCodes = (countryCode, provinceCode, cityCode) => {
  let address = '';
  const country = locations.find(c => '' + c.code === '' + countryCode);
  if (country) {
    address += country.cn_name + ' ';
    if (country.level2 && provinceCode) {
      const province = country.level2.find(c => '' + c.code === '' + provinceCode);
      if (province) {
        address += province.cn_name + ' ';
        if (province.level3 && cityCode) {
          const city = province.level3.find(c => '' + c.code === '' + cityCode);
          if (city) {
            address += city.cn_name;
          }
        }
      }
    }
  }
  return address;
};

export const formatOrder = (order) => {
  order.id = order.order_no;
  order.item = {
    title: order.title,
    id: order.item_id,
  };
  order.snapshot = {
    id: order.order_no,
    text: '查看快照'
  }
};

export const s2t = chineseConverter;
export const pickProps = (keys, obj) => keys.reduce((a, c) => ({...a, [c]: obj[c]}), {});
export const readableHash = (hash) => {
  const K = 1000
  const M = K * 1000
  const G = M * 1000
  const T = G * 1000
  const P = T * 1000

  const unitList = ['P', 'T', 'G', 'M', 'K']
  const unitMap = {P, T, G, M, K}

  for (let unit of unitList) {
    let unitAmount = unitMap[unit]

    if (hash >= unitAmount) {
      return {text: hash / unitAmount + unit + 'H/s', number: hash / unitAmount, unit: unitAmount}
    }
  }
  return {text: hash + 'H/s', number: hash, unit: 1}
};
export const JSONToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line !== '') line += ','

      line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
};
export const exportCSVFile = (headers, items, fileTitle) => {
  let target = [];
  if (headers) {
    target.unshift(headers);
    items.forEach(i => {
      let item = {}
      for (let prop in headers) {
        item[prop] = i[prop] || ''
      }
      target.push(item)
    })
  } else {
    target = items.slice(0)
  }

  // Convert Object to JSON
  const jsonObject = JSON.stringify(target);

  const csv = JSONToCSV(jsonObject);

  const exportedFilenmae = fileTitle + '.csv' || 'export.csv';

  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

