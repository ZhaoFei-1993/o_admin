import Vue from 'vue';

const priceSymbolMap = {
  1: '¥',   // 人民币
  2: '$'    // 美元
};

const noop = () => '';

export const formatDuration = (durationNum, format, $t = noop) => {
  if (!durationNum) {
    return '--';
  }
  const day = Math.floor(durationNum / 86400);
  const hour = Math.floor((durationNum % 86400) / 3600);
  const minute = Math.floor((durationNum % 3600) / 60);
  const second = Math.floor(durationNum % 60);
  if (format) {
    return format.replace(/d/i, day).replace(/h/i, hour).replace(/m/i, minute).replace(/s/i, second);
  }
  return (day ? (day + $t(`global.misc.天`)) : '') + (hour ? (hour + $t(`global.misc.小时`)) : '') + (durationNum < 86400 && minute ? (minute + $t(`global.misc.分钟`)) : '') + (durationNum < 3600 && second ? (second + $t(`global.misc.秒`)) : '');
};
export const formatTime = (time, lang) => {
  // 后端返回的是秒
  if (!time) return '';
  const date = new Date(time * 1000);
  if (!lang || !lang.lang) {
    return date.toLocaleString();
  }
  switch (lang.lang) {
    case 'zh_Hans_CN':
    case 'zh_Hant_HK':
      return date.toLocaleString();
    case 'en_US':
    default:
      return date.toString().replace(/GMT.*/, '');
  }
};
export const itemText = (value, options) => {
  const item = options.find(r => r.value === value);
  return item ? (item.text) : '--';
};
/**
 * 根据输入的en/cn/hk名称的配置，和当前语言，输出对应的语言文本
 * @param location {Object} {cn_name: '', hk_name: '', en_name: '', name: ''}
 * @param lang {Object}
 * @return {*}
 */
export const translateName = (location, lang) => {
  if (!location) return '';
  let name;
  switch (lang.lang) {
    case 'zh_Hans_CN':
      name = location.cn_name;
      break;
    case 'zh_Hant_HK':
      name = location.hk_name;
      break;
    case 'en_US':
    default:
      name = location.en_name;
  }
  return name || location.name;
};
export default ({
  app,
  store,
}) => {
  if (Vue.$plugins_filter_installed) {
    return;
  }
  Vue.$plugins_filter_installed = true;
  Vue.mixin({
    methods: {
      formatDuration,
      itemText,
      formatTime: (time) => {
        return formatTime(time, store.state.lang);
      },
      translateName: location => translateName(location, store.state.lang),
      // 根据法币价格、法币类型、coin类型计算等值coin
      equivalentCoin: (price, priceType, coinType) => {
        return price / store.state.constant.coinsPrice[coinType][priceType];
      }
    },
    filters: {

      /**
       * 根据传入的price和coin类型，输出对应的汇率文本。
       * @param priceType
       * @param coinType
       * @param constant
       * @return {string}
       */
      exchangeRateText([coinType, priceType, constant]) {
        const {coinTypeMap, priceTypeMap, coinsPrice} = constant;
        return `${coinTypeMap[coinType]}/${priceTypeMap[priceType].toUpperCase()}=${priceSymbolMap[priceType]}${coinsPrice[coinType][priceType]}`;
      },
      formatDuration: formatDuration,
      formatTime: (time) => {
        return formatTime(time, store.state.lang);
      },
      translateName: location => translateName(location, store.state.lang),
      itemText,
    }
  });
};
