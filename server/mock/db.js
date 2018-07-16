const faker = require('faker/locale/zh_CN')

module.exports = () => {
  const data = {
    users: [],
    items: [],
    orders: [],
  }
  // Create data with faker
  for (let i = 0; i < 1000; i++) {
    data.users.push({
      id: i,
      name: faker.name.findName(),
      create_time: faker.date.past(),
      first_trade_time: faker.date.past(),
      address: faker.address.country(),
      status: faker.random.arrayElement(['forbidden', 'normal']),
      email: faker.random.word() + faker.internet.email(),
      mobile: faker.phone.phoneNumber(),
      kyc_status: faker.random.arrayElement(['passed', 'processing', 'no']),
      role: faker.random.arrayElement(['normal', 'merchant']),
      kyc_name: faker.name.findName(),
      kyc_number: faker.random.number(),
      self_description: '诚信交易，能下单人就是在线的。联系电话：14888888888',
      trade_count_last_30_days: faker.random.number(),
      trade_count_total: faker.random.number(),
      average_response_time: faker.random.number(),
      recent_deal_count: faker.random.number(),
      recent_order_count: faker.random.number(),
      average_pay_time: faker.random.number(),
      average_release_time: faker.random.number(),
      email_verified: faker.random.boolean(),
      phone_verified: faker.random.boolean(),
      idcard_verified: faker.random.boolean(),
    })
    const randUser = data.users[faker.random.number({max: i})]
    data.items.push({
      id: i,
      user_id: randUser.id,
      user: randUser,
      side: faker.random.arrayElement(['buy', 'sell']),
      coin_type: faker.random.arrayElement(['BTC', 'BCH', 'ETH', 'USDT']), // 数字货币币种
      cash_type: faker.random.arrayElement(['CNY']), // 法币货币币种
      pricing_type: faker.random.arrayElement([1, 2]),
      float_rate: faker.random.number({max: 100}),
      price_limit: faker.random.number({max: 1000}),
      price: faker.random.number(),
      coin_amount: faker.random.number(),
      remain_coin_amount: faker.random.number(),
      freeze_coin_amount: faker.random.number(),
      min_deal_cash_amount: faker.random.number({max: 100}),
      max_deal_cash_amount: faker.random.number({min: 101}),
      counterparty_limit: faker.random.number(),
      auto_reply_content: faker.lorem.sentence(),
      status: faker.random.arrayElement([0, 1]),
      create_time: faker.date.past(),
      update_time: faker.date.past(),
    })
    const orderStatus = faker.random.arrayElement(['success', 'created', 'paid', 'cancel', 'closed'])
    data.orders.push({
      id: i,
      item_id: faker.random.number(), // 可能广告不存在，顺便测试错误吧
      merchant_id: faker.random.number({max: 1000}),
      user_id: faker.random.number({max: 1000}),
      user_side: faker.random.arrayElement(['buy', 'sell']),
      coin_type: faker.random.arrayElement(['BTC', 'BCH', 'ETH', 'USDT']),
      coin_amount: faker.random.number(),
      cash_type: faker.random.arrayElement(['CNY']),
      cash_amount: faker.random.number(),
      price: faker.random.number() * faker.random.number({max: 10}),
      memo: faker.random.word(),
      appeal_status: faker.random.arrayElement(['', 'processing', 'completed']),
      status: orderStatus,
      is_reopened: faker.random.boolean(),
      create_time: faker.date.past(),
      update_time: faker.date.past(),
      place_time: faker.date.past(),       // 下单时间
      pay_time: orderStatus === 'created' ? null : faker.date.past(),         // 支付时间
      complete_time: ['success', 'cancel', 'closed'].indexOf(orderStatus) > -1 ? faker.date.past() : null,    // 完成时间，success cancel closed状态
      appeal_time: faker.date.past(),      // 申诉时间
    })
  }
  return data
}
