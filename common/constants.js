const baseDomain = require("../config/baseURL");
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
},];
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
},];
export const merchantStatusTypes = [{
  value: 'normal', text: '正常',
}, {
  value: 'forbidden', text: '限制发布广告',
},];
export const merchantAuthStatusTypes = [{
  value: 'created', text: '商家认证中',
}, {
  value: 'pass', text: '认证商家',
}, {
  value: 'no', text: '审核未通过',
},];
export const kycStatusTypes = [{
  value: 'no', text: '未实名',
}, {
  value: 'processing', text: '认证中',
}, {
  value: 'passed', text: '已认证',
},];
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
  value: 'draw', text: '平局',
}, {
  value: 'buyer_win', text: '买家胜诉',
}, {
  value: 'seller_win', text: '卖家胜诉',
}];

export const orderResultTypes = [{
  value: 'none', text: '协调双方自行解决',
}, {
  value: 'receipt_order', text: '将币划给买方',
}, {
  value: 'cancel_order', text: '将冻结的币释放给卖家',
}];

export const coinTypes = ['BTC', 'BCH', 'ETH', 'USDT'];

export const paymentTypes = [{
  value: 'alipay', text: '支付宝',
}, {
  value: 'wechat', text: '微信支付',
}, {
  value: 'bankcard', text: '银行卡',
},]
export const sides = [{
  value: 'buy', text: '买入',
}, {
  value: 'sell', text: '卖出',
},]

export const counterpartyLimitTypes = [{
  text: '交易方必须通过手机验证',
  value: 'bind_phone'
}, {
  text: '交易方必须通过实名验证',
  value: 'kyc',
}, {
  text: '交易方必须完成过 1 次交易',
  value: 'one_deal',
}]

export const userRoles = [{
  value: true, text: '认证商家',
}, {
  value: false, text: '普通用户',
},]
export const balanceHistoryTypes = [{
  value: 'buy_order', text: '购买',
}, {
  value: 'sell_order', text: '出售',
}, {
  value: 'transfer_in', text: '转入',
}, {
  value: 'transfer_out', text: '转出',
}]
export const licenseTypes = [{
  value: 'id_card', text: '身份证',
}, {
  value: 'passport', text: '护照',
}, {
  value: 'driving_license', text: '驾驶证',
}]
export const paymentStatusTypes = [{
  value: 'on', text: '开启',
}, {
  value: 'off', text: '关闭',
}]