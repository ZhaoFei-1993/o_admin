import {timeToLocale} from './utilities';
import {itemText} from '../plugins/filters';

const baseDomain = require('../config/baseURL');
export const loginURL = baseDomain.loginURL;
export const roles = [{
  value: 'merchant', text: '认证商家',
}, {
  value: 'normal', text: '普通用户',
}];
export const userStatusTypes = [{
  value: 'normal', text: '正常',
}, {
  value: 'forbidden', text: '限制交易',
}];
export const itemStatusTypes = [{
  value: 'on', text: '上架',
}, {
  value: 'off', text: '下架',
}, {
  value: 'deleted', text: '已删除',
},
];
export const pricingTypes = [{
  value: 'fixed', text: '固定',
}, {
  value: 'float', text: '浮动',
}];
export const merchantStatusTypes = [{
  value: 'normal', text: '正常',
}, {
  value: 'forbidden', text: '限制发布广告',
}];
export const merchantAuthStatusTypes = [{
  value: 'created', text: '申请商家认证中',
}, {
  value: 'pass', text: '已通过商家认证',
}, {
  value: 'no', text: '商家认证未通过',
}, {
  value: 'cancelling', text: '申请取消审核中',
}, {
  value: 'cancelled', text: '已取消商家认证',
}];
export const kycStatusTypes = [{
  value: 'no', text: '未实名',
}, {
  value: 'processing', text: '初级认证中',
}, {
  value: 'pass', text: '初级认证成功',
}, {
  value: 'fail', text: '初级认证失败',
}, {
  value: 'advanced_processing', text: '高级认证中',
}, {
  value: 'advanced_pass', text: '高级认证成功',
}, {
  value: 'advanced_fail', text: '高级认证失败',
}];
export const orderStatusTypes = [{
  value: 'created', text: '已下单',
}, {
  value: 'paid', text: '已付款',
}, {
  value: 'success', text: '已完成',
}, {
  value: 'cancel', text: '已取消',
}, {
  value: 'closed', text: '已关闭',
}];
export const appealStatusTypes = [{
  value: 'created', text: '申诉等待中',
}, {
  value: 'processing', text: '申诉处理中',
}, {
  value: 'pending', text: '申诉挂起中',
}, {
  value: 'cancel', text: '已取消申诉',
}, {
  value: 'completed', text: '已申诉解决',
}];

export const appealResultTypes = [{
  value: 'draw', text: '取消申诉',
}, {
  value: 'buyer_win', text: '买家胜诉',
}, {
  value: 'seller_win', text: '卖家胜诉',
}];

export const orderResultTypes = [{
  value: 'none', text: '订单不变',
}, {
  value: 'receipt_order', text: '订单完成(币给买方)',
}, {
  value: 'cancel_order', text: '订单取消(币还卖家)',
}];

export const coinTypes = ['BCH', 'BTC', 'ETH', 'USDT', 'CET'];
export const activeCoinTypes = ['BCH', 'BTC', 'ETH', 'USDT'];

export const paymentTypes = [{
  value: 'alipay', text: '支付宝',
}, {
  value: 'wechat', text: '微信支付',
}, {
  value: 'bankcard', text: '银行卡',
}];
export const sides = [{
  value: 'buy', text: '买入',
}, {
  value: 'sell', text: '卖出',
}];

export const counterpartyLimitTypes = [{
  text: '交易方必须通过手机验证',
  value: 'bind_phone'
}, {
  text: '交易方必须通过实名验证',
  value: 'kyc',
}, {
  text: '交易方必须完成过 1 次交易',
  value: 'one_deal',
}];

export const userRoles = [{
  value: true, text: '认证商家',
}, {
  value: false, text: '普通用户',
}];
export const balanceHistoryTypes = [{
  value: 'buy_order', text: '购买',
}, {
  value: 'sell_order', text: '出售',
}, {
  value: 'transfer_in', text: '转入',
}, {
  value: 'transfer_out', text: '转出',
}, {
  value: 'gift', text: '赠送',
}];
export const licenseTypes = [{
  value: 'id_card', text: '身份证',
}, {
  value: 'passport', text: '护照',
}, {
  value: 'driving_license', text: '驾驶证',
}];
export const paymentStatusTypes = [{
  value: 'on', text: '开启',
}, {
  value: 'off', text: '关闭',
}];
export const COLORS = ['#b2d9fd', '#fae7a3', '#ceeaaf', '#ffddd3', '#d4bfe8', '#b1ebde', '#ffd5bb', '#a9b2e0', '#e0a9cf', '#e0d0a9']; // 头像基础色号
export const configProjectTypes = [{
  value: 'web', text: '网页端',
}, {
  value: 'mobile', text: '移动端',
}];
export const statsCategories = ['item', 'order', 'user', 'merchant'];
export const statsPeriodTypes = [{
  value: 'daily', text: '每天',
}, {
  value: 'weekly', text: '每周',
}, {
  value: 'monthly', text: '每月',
}];
export const itemStatsColumns = [
  {
    prop: 'report_date',
    label: '日期',
    formatter: (row, col, cell) => {
      return timeToLocale(cell, true);
    },
    xAxis: true,
  }, {
    prop: 'coin_type',
    label: '币种',
    formatter: (row, col, cell) => {
      return cell || '全部';
    },
  }, {
    prop: 'side',
    label: '方向',
    formatter: (row, col, cell) => {
      return itemText(cell, sides);
    },
  }, {
    prop: 'item_count',
    label: '上架广告数',
    chartLine: true,
  }, {
    prop: 'merchant_count',
    label: '上架商家数',
    chartLine: true,
  }, {
    prop: 'deal_count',
    label: '成交订单数',
    chartLine: true,
  }, {
    prop: 'cash_amount',
    label: '成交额',
  }, {
    prop: 'cash_avg_amount',
    label: '广告平均成交',
  },
];
export const orderStatsColumns = [
  {
    prop: 'report_date',
    label: '日期',
    formatter: (row, col, cell) => {
      return timeToLocale(cell, true);
    },
    xAxis: true,
  }, {
    prop: 'coin_type',
    label: '币种',
    formatter: (row, col, cell) => {
      return cell || '全部';
    },
  }, {
    prop: 'order_count',
    label: '下单笔数',
    chartLine: true,
  }, {
    prop: 'deal_count',
    label: '成交笔数',
    chartLine: true,
  }, {
    prop: 'coin_amount',
    label: '成交币量',
    chartLine: true,
  }, {
    prop: 'deal_rate',
    label: '成交率',
  }, {
    prop: 'cash_avg_amount',
    label: '每笔平均成交额',
  }, {
    prop: 'appeal_count',
    label: '申诉数',
  }, {
    prop: 'appeal_rate',
    label: '申诉率',
  },
];
export const userStatsColumns = [
  {
    prop: 'report_date',
    label: '日期',
    formatter: (row, col, cell) => {
      return timeToLocale(cell, true);
    },
    xAxis: true,
  }, {
    prop: 'total_count',
    label: '用户数',
    chartLine: true,
  }, {
    prop: 'new_count',
    label: '新增用户数',
    chartLine: true,
  }, {
    prop: 'trade_count',
    label: '交易过的用户数',
    chartLine: true,
  }, {
    prop: 'trade_rate',
    label: '交易率',
    chartLine: true,
  }, {
    prop: 'deal_count',
    label: '成交过用户数',
  }, {
    prop: 'deal_rate',
    label: '成交率',
  },
];
export const merchantStatsColumns = [
  {
    prop: 'report_date',
    label: '日期',
    formatter: (row, col, cell) => {
      return timeToLocale(cell, true);
    },
    xAxis: true,
  }, {
    prop: 'total_count',
    label: '商家数',
    chartLine: true,
  }, {
    prop: 'new_count',
    label: '新增商家数',
    chartLine: true,
  }, {
    prop: 'trade_count',
    label: '挂单商家数',
    chartLine: true,
  }, {
    prop: 'trade_rate',
    label: '挂单率',
    chartLine: true,
  }, {
    prop: 'deal_count',
    label: '成交笔数',
  }, {
    prop: 'cash_amount',
    label: '成交额',
  }, {
    prop: 'cash_avg_amount',
    label: '平均成交额',
  },
];
export const statsProps = {
  item: {
    label: '广告',
    columns: itemStatsColumns,
    filters: [
      {name: 'side', text: '方向', value: 'buy', options: sides, clearable: true},
      {name: 'coin_type', text: '币种', value: 'BCH', options: activeCoinTypes, clearable: true},
    ],
    link: 'report/item',
  },
  order: {
    label: '订单',
    columns: orderStatsColumns,
    filters: [
      {name: 'coin_type', text: '币种', value: 'BCH', options: activeCoinTypes, clearable: true},
    ],
    link: 'report/order',
  },
  user: {
    label: '用户',
    columns: userStatsColumns,
    filters: null,
    link: 'report/user',
  },
  merchant: {
    label: '商家',
    columns: merchantStatsColumns,
    filters: null,
    link: 'report/merchant',
  },
};
