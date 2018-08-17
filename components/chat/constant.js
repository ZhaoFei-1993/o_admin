/**
 * IM常量定义
 */
import { TextMessage } from 'leancloud-realtime';
import { ImageMessage } from 'leancloud-realtime-plugin-typed-messages';

export const COLORS = ['#b2d9fd', '#fae7a3', '#ceeaaf', '#ffddd3', '#d4bfe8', '#b1ebde', '#ffd5bb', '#a9b2e0', '#e0a9cf', '#e0d0a9'];

export const MESSAGE_TYPE = {
  image: ImageMessage.TYPE,
  text: TextMessage.TYPE,
  auto: -101, // 自动回复
  order: -102, // 订单消息
};

export const ORDER_MESSAGES = {
  order_create: {
    me: '订单已生成，请您及时付款。',
    other: '订单已生成，请等待对方付款。',
    customer: '订单已生成，等待买方付款。',
  },
  order_pay: {
    me: '您已将订单标为“已付款”状态，请等待对方确认收款。',
    other: '对方已将订单标为“已付款”状态，请及时查收并确认收款。',
    customer: '买方已将订单标记为“已付款”状态。',
  },
  order_receipt: {
    me: '您已确认收款，对方将收到您出售的数字货币。',
    other: '对方已确认收款，您所购买的数字货币已发放到您的OTC钱包，请查收。',
    customer: '卖方已确认收款。',
  },
  order_cancel: {
    me: '订单已取消。',
    other: '订单已取消。',
    customer: '订单已取消。',
  },
  order_close: {
    me: '订单超时已关闭。',
    other: '订单超时已关闭。',
    customer: '订单超时已关闭。',
  },
  appeal_create: {
    me: '您已发起申诉，请等待客服介入。',
    other: '对方已发起申诉，请等待客服介入。',
    customer: { // 还需要再细分买卖双方
      byBuyer: '买方已发起申诉。',
      bySeller: '卖方已发起申诉。',
    },
  },
  appeal_cancel: {
    me: '您已取消申诉。',
    other: '对方已取消申诉。',
    customer: { // 还需要再细分买卖双方
      byBuyer: '买方已取消申诉。',
      bySeller: '卖方已取消申诉。',
    },
  },
  appeal_close: {
    me: '申诉完成。',
    other: '申诉完成。',
    customer: '申诉完成。',
  },
};
