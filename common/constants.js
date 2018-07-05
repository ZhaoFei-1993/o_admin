import {getAddressByCodes, getItemStatusOfIndex, mapCoinType, readableHash, timeToLocale} from "./utilities";

const baseDomain = require("../config/baseURL");

export const orderStatus = [
  '等待买家付款', '等待卖家发货', '等待买家收货', '退款处理', '交易成功', '交易关闭'
];

export const freezeStatus = [
  {
    label: '冻结中',
    value: true,
  }, {
    label: '未冻结',
    value: false,
  },
];
export const otherContactType = [
  'email', 'wechat', 'telegram', 'whatsapp'
]
export const productTypes = [
  '矿机',
  '电源',
];
export const statsTypes = [
  '每天',
  '每月',
];
export const coinNames = ["BCH", "ETH", "BTC", "LTC"];
export const priceNames = ["unknown", "CNY", "USD"];
export const itemStatus = [
  '已删除', '待支付', '已上架', '已下架', '已过期', '强制下架'
]; // 后端index从-1开始的
export const itemOperationTypes = [
  '创建广告', '支付广告', '编辑广告', '广告过期',
  '下架广告', '上架广告', '广告续费', '删除广告', '修改价格', '修改库存',
  '强制下架', '恢复上架'
];
export const orderOperationTypes = [
  "买家提交订单",
  "买家付款",
  "卖家发货",
  "买家延期收货",
  "买家确认收货",
  "系统确认收货",
  "买家取消订单",
  "系统取消订单",
  "买家申请退款",
  "买家取消退款",
  "卖家接受退款",
  "系统接受退款",
  "管理员冻结",
  "管理员解冻",
  "管理员付款给卖家",
  "管理员付款给买家",
  "管理员延期收货",
];
export const manageOrder = {
  freeze: {code: 12, confirm: "确认接受申诉并冻结订单？"},
  unfreeze: {code: 13, confirm: "确认撤销申诉？"},
  receive: {code: 14, confirm: "确认付款给卖方？"},
  refund: {code: 15, confirm: "确认付款给买方？"},
  delay: {code: 16, confirm: "确认延期收货？"},
}
export const adminUsers = '/users';


export const orderProps = [{
  prop: 'item',
  link: '/items',
  label: '标题',
  text: 'title',
}, {
  prop: 'price',
  label: '单价',
  formatter: (v, resource) => {
    return resource['price'] + ' ' + priceNames[resource.price_type];
  },
}, {
  prop: 'sell_user',
  link: adminUsers, // TODO
  label: '卖方',
  text: 'username',
}, {
  prop: 'volume',
  label: '数量',
}, {
  prop: 'buy_user',
  link: adminUsers, // TODO
  label: '买方',
  text: 'username',
}, {
  prop: 'coin_type',
  label: '支付币种',
  options: coinNames,
}, {
  prop: 'status',
  label: '状态',
  options: orderStatus,
}, {
  prop: 'exchange_rate',
  label: '支付汇率',
  formatter: (v, resource) => {
    return resource.coin_total_price > 0
      ? (resource.total_price / resource.coin_total_price + ' ' + priceNames[resource.price_type] + '/' + coinNames[resource.coin_type])
      : '数据有误';
  }
}, {
  prop: 'total_price',
  label: '支付法币',
  formatter: (v, resource) => {
    return resource.total_price + ' ' + priceNames[resource.price_type];
  }
}, {
  prop: 'sell_user',
  label: '卖方预留手机',
  formatter: (v) => {
    return v.contact_phone;
  }
}, {
  prop: 'coin_total_price',
  label: '支付币额',
  formatter: (v, resource) => {
    return resource.coin_total_price + ' ' + coinNames[resource.coin_type];
  }
}, {
  prop: 'logistics_company',
  label: '物流信息',
  formatter: (v, resource) => {
    return resource.logistics_company + ' ' + resource.logistics_no;
  },
}, {
  prop: 'address_country_code',
  label: '收货地',
  formatter: (v, resource) => {
    return getAddressByCodes(resource.address_country_code, resource.address_province_code, resource.address_city_code) + resource.address_detail;
  }
}, {
  prop: 'postcode',
  label: '邮编',
}, {
  prop: 'consignee_name',
  label: '收货人姓名',
  formatter: (v, resource) => {
    return resource.buy_user.consignee_name;
  },
}, {
  prop: 'delay_receive_times',
  label: '已延期次数',
}, {
  prop: 'contact_phone',
  label: '收货人手机',
  formatter: (v, resource) => {
    return resource.buy_user.contact_phone;
  },
}];

export const itemProps = [{
  prop: 'brand_category',
  label: '品牌',
  formatter: (v) => {
    return v.cn_name || v.name || v.en_name;
  }
}, {
  prop: 'title',
  label: '标题',
}, {
  prop: 'model_category',
  label: '型号',
  formatter: (v) => {
    return v.cn_name || v.name || v.en_name;
  }
}, {
  prop: 'user',
  link: adminUsers,
  label: '用户',
  text: 'username',
}, {
  prop: 'kind_category_id',
  label: '产品类型',
  formatter: (v) => {
    return productTypes[v - 1];
  }
}, {
  prop: 'hashrate',
  labelFormatter: (resource) => {
    return resource.kind_category_id === 1 ? "算力" : "功耗";
  },
  formatter: (v, resource) => {
    return resource.kind_category_id === 1 ? readableHash(v).text : (resource.power + '瓦')
  },
}, {
  prop: 'status',
  label: '状态',
  formatter: (cellValue) => {
    return getItemStatusOfIndex(cellValue, itemStatus);
  },
}, {
  prop: 'production_date',
  label: '出厂日期',
  formatter: (v) => {
    return timeToLocale(v, true)
  },
}, {
  prop: 'issue_time',
  label: '发布时间',
  formatter: (v) => {
    return timeToLocale(v)
  },
}, {
  prop: 'is_under_warranty',
  label: '是否在保',
  formatter: (bool) => {
    return bool ? "是" : "否"
  },
}, {
  prop: 'create_time',
  label: '创建时间',
  formatter: (v) => {
    return timeToLocale(v)
  },
}, {
  prop: 'is_with_power',
  labelFormatter: (resource) => {
    return resource.kind_category_id === 1 ? "电源" : "是否含电源线";
  },
  formatter: (v, resource) => {
    return resource.kind_category_id === 1 ? (resource.is_with_power === 0 ? "不含电源" : (resource.is_with_power === 1 ? "含官电" : "含非官电")) : (resource.is_with_power_cord ? "是" : "否")
  },
}, {
  prop: 'modify_time',
  label: '更新时间',
  formatter: (v) => {
    return timeToLocale(v)
  },
}, {
  prop: 'is_brand_new',
  label: '是否全新',
  formatter: (bool) => {
    return bool ? "是" : "否"
  },
}, {
  prop: 'expire_time',
  label: '有效期至',
  formatter: (v) => {
    return timeToLocale(v)
  },
}, {
  prop: 'price',
  label: '价格',
  formatter: (v, resource) => {
    return resource.price + ' ' + (resource.price_type === 1 ? 'CNY' : 'USD');
  },
}, {
  prop: 'contact_phone',
  label: '预留手机',
}, {
  prop: 'pay_methods',
  label: '卖家接受币种',
  formatter: (v) => {
    return mapCoinType(v)
  },
}, {
  prop: 'other_contact_info',
  label: '备用联系方式',
  formatter: (v, resource) => {
    const info = '' + (resource.sell_user ? resource.sell_user.other_contact_info : resource.other_contact_info);
    if (!info.length) return '无';
    return otherContactType[resource.other_contact_type] + ': ' + info;
  },
}, {
  prop: 'inventory',
  label: '库存',
}, {
  prop: 'operations',
  label: '操作记录',
  suffixLink: 'operations',
  text: '查看',
}, {
  prop: 'number_sold',
  label: '已售',
}, {
  prop: 'delivery_country_code',
  label: '发货地',
  formatter: (v, resource) => {
    return getAddressByCodes(resource.delivery_country_code, resource.delivery_province_code, resource.delivery_city_code);
  }
}, {
  prop: 'min_trading_volume',
  label: '最小购买数量',
}];

export const snapshotProps = [...itemProps.filter(p => ['pay_methods', 'contact_phone'].indexOf(p.prop) < 0), {
  prop: 'status',
  label: '订单状态',
  options: orderStatus,
}, {
  prop: 'buy_user',
  label: '买家',
  formatter: (v, resource) => {
    return v.consignee_name || v.contact_name || v.username;
  },
}, {
  prop: 'sell_user',
  label: '卖家',
  formatter: (v, resource) => {
    return v.consignee_name || v.contact_name || v.username;
  },
}, {
  prop: 'buy_user',
  label: '买家电话',
  formatter: (v, resource) => {
    return v.contact_phone ? (v.contact_phone_country_code + ' ' + v.contact_phone) : (v.mobile || '暂缺');
  },
}, {
  prop: 'sell_user',
  label: '卖家电话',
  formatter: (v, resource) => {
    return v.contact_phone_country_code + ' ' + v.contact_phone;
  },
}, {
  prop: 'coin_type',
  label: '买家支付币种',
  formatter: (v) => {
    return coinNames[v]
  },
}, {
  prop: 'volume',
  label: '购买数量',
}];

export const itemStatsColumns = [
  {
    prop: 'date',
    label: '日期',
    formatter: (row, col, cell) => {
      return timeToLocale(cell, true);
    },
    sortable: true,
    xAxis: true,
  }, {
    prop: 'on',
    label: '上架广告',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'off',
    label: '下架广告',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'init',
    label: '未发布广告',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'expired',
    label: '已过期广告',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'deleted',
    label: '已删除广告',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'new_total',
    label: '新增广告',
    sortable: true,
  }, {
    prop: 'total',
    label: '广告总数',
    sortable: true,
  }
];

export const orderStatsColumns = [
  {
    prop: 'date',
    label: '日期',
    formatter: (row, col, cell) => {
      return timeToLocale(cell, true);
    },
    sortable: true,
    xAxis: true,
  }, {
    prop: 'init_order',
    label: '待支付',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'paid_order',
    label: '待发货',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'delivered_order',
    label: '待收货',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'refunding_order',
    label: '退款',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'done_order',
    label: '成功',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'closed_order',
    label: '关闭',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'new_total_order',
    label: '新增',
    sortable: true,
  }, {
    prop: 'new_done_order',
    label: '新完成',
    sortable: true,
  }, {
    prop: 'total_order',
    label: '所有',
    sortable: true,
  }
];

export const userStatsColumns = [
  {
    prop: 'date',
    label: '日期',
    formatter: (row, col, cell) => {
      return timeToLocale(cell, true);
    },
    sortable: true,
    xAxis: true,
  }, {
    prop: 'buy_user',
    label: '买家',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'sell_user',
    label: '卖家',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'new_buy_user',
    label: '新增买家',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'new_sell_user',
    label: '新增卖家',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'total_user',
    label: '所有',
    sortable: true,
  }
];

export const incomeStatsColumns = [
  {
    prop: 'date',
    label: '日期',
    formatter: (row, col, cell) => {
      return timeToLocale(cell, true);
    },
    sortable: true,
    xAxis: true,
  }, {
    prop: 'guarantee_amount',
    label: '担保',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'ad_amount',
    label: '广告',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'new_guarantee_amount',
    label: '新增担保',
    sortable: true,
    chartLine: true,
  }, {
    prop: 'new_ad_amount',
    label: '新增广告',
    sortable: true,
    chartLine: true,
  }
];

export const statsProps = {
  items: {
    label: '广告',
    columns: itemStatsColumns,
    link: 'report/item',
  },
  orders: {
    label: '订单',
    columns: orderStatsColumns,
    link: 'report/order',
  },
  users: {
    label: '用户',
    columns: userStatsColumns,
    link: 'report/user',
  },
  incomes: {
    label: '收入',
    columns: incomeStatsColumns,
    link: 'report/income',
  },
};
export const poolUsersList = baseDomain.poolAdmin + '/admin/user/list/?admin_level=1';
export const poolUserById = baseDomain.poolAdmin + '/admin/?account=';
export const loginURL = baseDomain.loginURL;
export const languages = [{key: 'cn', label: '简体中文'}, {key: 'hk', label: '繁体中文'}, {key: 'en', label: 'English'}];
export const authTypes = {
  NONE: {value: 0, text: '未提交认证', type: undefined},
  PERSON: {value: 1, text: '个人认证', type: 'warning'},
  ENTERPRISE: {value: 2, text: '企业认证', type: 'success'},
};
export const authStatus = {
  NONE: {value: 0, text: '未提交认证', type: undefined},
  WAIT: {value: 1, text: '审核中', type: 'info'},
  SUCCESS: {value: 2, text: '已认证', type: 'success'},
  FAIL: {value: 3, text: '认证失败', type: 'danger'},
};

export const refundHeaders = {
  id: '退款ID',
  user_id: '用户ID',
  username: '用户名',
  order_id: '订单ID',
  payee_username: '收款人姓名',
  payee_bank_name: '收款人银行',
  payee_bank_card_no: '收款人银行卡号',
  coin_amount: '应付金额',
  coin_type: '货币类型',
  pay_coin_amount: '实际支付金额',
  pay_bank_card_no: '支付银行卡号',
  bank_flow_no: '银行流水号',
};

export const settlementHeaders = {
  id: '结算ID',
  user_id: '用户ID',
  username: '用户名',
  payee_username: '收款人姓名',
  payee_bank_name: '收款人银行',
  payee_bank_card_no: '收款人银行卡号',
  coin_amount: '应付金额',
  coin_type: '货币类型',
  pay_coin_amount: '实际支付金额',
  pay_bank_card_no: '支付银行卡号',
  bank_flow_no: '银行流水号',
};

export const businessType = [
  {name: 'UNDEFINED', cn: '不存在'},
  {name: 'MALL_ISSUE_ITEM', cn: '发布广告'},
  {name: 'MALL_PAY_ORDER', cn: '支付订单'},
  {name: 'MALL_ORDER_RECEIVE', cn: '订单收款'},
  {name: 'MALL_ORDER_REFUND', cn: '退款'},
  {name: 'OFFLINE_SETTLEMENT', cn: '线下结算'},
];
export const payFlowStatus = ['等待', '成功', '失败'];