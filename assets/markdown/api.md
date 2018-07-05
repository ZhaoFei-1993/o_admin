# BTC 区块数据 API
------------------

协议：HTTPS

数据格式：JSON

Content-Type :'application/json’'


### 最近出块查询

* 请求:

GET  HOST/res/btc/recent_blocks?limit=10

|参数名|类型|必须|备注|
| -----|----|----|----|
| limit | int | no | 默认 15 |


* 响应:

```
{
    "code": 0,
    "err_msg": "",
    "content": {
        "size": 15,
        "data":[
            {
                "hash": string 哈希,
                "height": int 高度,
                "time": string 时间,
                "relayed_by": string 块播报方,
                "size": int 大小,
                "version": int 块版本,
                "difficulty": string 块难度,
                "prev_block_hash": string 前向块哈希，如不存在，则为 null,
                "next_block_hash": string 后向块哈希，如不存在，则为 null,
                "block_reward": string 块奖励,
                "confirmations": int 确认数,
                "tx_count": int 总交易数量,
                "input": string 总输入,
                "output": string 总输出,
                "tx_fees": string 总交易费,
                "total_reward": string 区块总收益,
                "chain_tag": string “Main Chain” | "Orphaned",
            },
            {
                "hash": string 哈希,
                "height": int 高度,
                "time": string 时间,
                "relayed_by": string 块播报方,
                "size": int 大小,
                "version": int 块版本,
                "difficulty": string 块难度,
                "prev_block_hash": string 前向块哈希，如不存在，则为 null,
                "next_block_hash": string 后向块哈希，如不存在，则为 null,
                "block_reward": string 块奖励,
                "confirmations": int 确认数,
                "tx_count": int 总交易数量,
                "input": string 总输入,
                "output": string 总输出,
                "tx_fees": string 总交易费,
                "total_reward": string 区块总收益,
                "chain_tag": string “Main Chain” | "Orphaned",
            },
            {
            }
        ]
    }
}
```

###  区块列表查询

请求:

GET  HOST/res/btc/blocks?page=1&limit=10&begin_data=2017-11-09&end_date=2017-11-10

|参数名|类型|必须|备注|
| -----|----|----|----|
| page| int | no | 默认1 |
| limit | int | no | 默认 15 |
| begin_date | string | no | 2017-11-09, 没有则返回最近 limit |
| end_date | string | no | 2017-11-10 |

响应:
```
{
    "code": 0,
    "err_msg": ""
    "content": {
        "total": 20,
        "size": 5,
        "total_page": 4,
        "current_page": 1,
        "data":[
            {
                "hash": string 哈希,
                "height": int 高度,
                "time": string 时间,
                "relayed_by": string 块播报方,
                "size": int 大小,
                "version": int 块版本,
                "difficulty": string 块难度,
                "prev_block_hash": string 前向块哈希，如不存在，则为 null,
                "next_block_hash": string 后向块哈希，如不存在，则为 null,
                "block_reward": string 块奖励,
                "confirmations": int 确认数,
                "tx_count": int 总交易数量,
                "input": string 总输入,
                "output": string 总输出,
                "tx_fees": string 总交易费,
                "total_reward": string 区块总收益,
                "chain_tag": string “Main Chain” | "Orphaned",
            },
            {
                "hash": string 哈希,
                "height": int 高度,
                "time": string 时间,
                "relayed_by": string 块播报方,
                "size": int 大小,
                "version": int 块版本,
                "difficulty": string 块难度,
                "prev_block_hash": string 前向块哈希，如不存在，则为 null,
                "next_block_hash": string 后向块哈希，如不存在，则为 null,
                "block_reward": string 块奖励,
                "confirmations": int 确认数,
                "tx_count": int 总交易数量,
                "input": string 总输入,
                "output": string 总输出,
                "tx_fees": string 总交易费,
                "total_reward": string 区块总收益,
                "chain_tag": string “Main Chain” | "Orphaned",
            },
            {
            }
        ]
    }
}
```

### 全网数据

请求:

GET HOST/res/btc/net_data

响应:
```
{
    "code": 0,
    "err_msg": ""
    "content": {
        "total_hashrate": string 全网算力,
        "difficulty": string 全网难度,
        "next_difficulty": string 预计下次难度,
        "next_diff_time”: string 距离下次调整时间,
        "coin_per_t": string coin收益/T/天,
        "cash_per_t": string cash 收益/T/天,
        "tx_pool_cout": int 待确认交易数,
        "tx_pool_size": string 待确认交易池大小,
        "daily_tx": int 24小时交易数,
        "daily_rate": string 24 小时交易速率,
        "best_tx_fee": string 当前最佳手续费,
    }
}
```

### 市场行情

请求:

GET HOST/res/btc/exchange_companies

响应:
```
{
    "code": 0,
    "err_msg": ""
    "content": {
        "size": int 交易所数量
        "data": [
            {
                "company": string 如 bitfinex,
                "market_desc": string 如 BTC/USD,
                "price": string 如 $47777,
            },
            {
                "company": string 如 bitfinex,
                "market_desc": string 如 BTC/USD,
                "price": string 如 $47777,
            }
        ]
    }
}
```

### 全网算力分布

请求：

GET HOST/res/btc/hashrate_distributions/{*period*}?page=1&limit=5

|参数名|类型|必须|备注|
| -----|----|----|----|
| period | url string | yes | 统计周期, e.g 24h/3d/1m/6m/all |
| page| int | no | 默认1 |
| limit | int | no | 默认 15 |

响应:
```
{
    "code": 0,
    "err_msg": ""
    "content": {
        "total": 20,
        "size": 5,
        "total_page": 4,
        "current_page": 1,
        "data":[
            {
                "pool": string 如 AntPool,
                "hashrate": string 如 1598.72 PH/s,
                "ratio": float 如 0.1921,
                "count": int 块数量
            },
            {
                "pool": string 如 AntPool,
                "hashrate": string 如 1598.72 PH/s,
                "ratio": float 如 0.1921,
                "count": int 块数量
            },
            {
                "pool": string 如 unknown,
                "hashrate": string 如 1598.72 PH/s,
                "ratio": float 如 0.1921,
                "count": int 块数量
            }
        ]
    }
}
```

### 区块详情

请求:

GET HOST/res/btc/blocks/{*block_hash* | *height*}

|参数名|类型|必须|备注|
| -----|----|----|----|
| block_hash | url string | yes | block_hash 和 height 2 选 1|
| height | url int | yes | block_hash 和 height 2 选 1|

响应:

```
{
    "code": 0,
    "err_msg": ""
    "content": {
        "hash": string 哈希,
        "height": int 高度,
        "time": string 时间,
        "relayed_by": string 块播报方,
        "size": int 大小,
        "version": int 块版本,
        "difficulty": string 块难度,
        "prev_block_hash": string 前向块哈希，如不存在，则为 null,
        "next_block_hash": string 后向块哈希，如不存在，则为 null,
        "block_reward": string 块奖励,
        "confirmations": int 确认数,
        "tx_count": int 总交易数量,
        "input": string 总输入,
        "output": string 总输出,
        "tx_fees": string 总交易费,
        "total_reward": string 区块总收益,
        "chain_tag": string “Main Chain” | "Orphaned",
    }
}
```

### 区块交易列表查询

请求：

GET HOST/res/btc/blocks/{*block_hash*}/transactions?page=1&limit=10

|参数名|类型|必须|备注|
| -----|----|----|----|
| block_hash | url string | yes | 区块 hash |
| page| int | no | 默认1 |
| limit | int | no | 默认 15 |

响应:
```
{
    "code": 0,
    "err_msg": ""
    "content": {
        "total": 20,
        "size": 5,
        "total_page": 4,
        "current_page": 1,
        "data":[
            {
                "txid": string 交易哈希
                "fee": string 该交易的手续费
                "is_coinbase": boolean 是否为 coinbase 交易
                "inputs": [   输入
                    {
                        "pre_txid": string 前向交易哈希
                        "prev_addresses": [
                            "address1",
                        ]
                        "prev_position": int 前向交易的输出位置
                        "prev_value": string 前向交易输入金额
                        "coinbase": string coinbase 交易才有
                    },
                    {
                        "txid": string 前向交易哈希
                        "prev_addresses": Array<String> 输出地址
                        "prev_position": int 前向交易的输出位置
                        "prev_value": string 前向交易输入金额
                    },
                ],
                "inputs_value": string 输入值
                "outputs": [ 输出
                    {
                        "addresses": Array<String> 输出地址
                        "value": string 输出金额
                        "next_txid": string 向后交易 hash
                        "next_position": string 向后交易 输出位置
                    },
                    {
                        "addresses": Array<String> 输出地址
                        "value": string 输出金额
                        "next_txid": string 向后交易 hash
                        "next_position": string 向后交易 输出位置
                    }
                ],
                "outputs_value": string 输出值
            },
            {
            }
        ]
    }
}
```

### 交易详情

请求:

GET HOST/res/btc/transactions/{*txid*}

|参数名|类型|必须|备注|
| -----|----|----|----|
| txid | url string | yes | |

响应:
```
{
    "code": 0,
    "err_msg": ""
    "content": {
        {
            "txid": string,
            "height": int 所在块高度,
            "chain_tag": string 主链标识 如 Main Chain
            "confirmations": int 确认数,
            "time": string 所在块时间
            "size": int 交易大小
            "weight": int 体积
            "inputs_value": string 输入值
            "outputs_value": string 输出值
            "fee": string 该交易的手续费
            "fee_rate": string 费率
            is_coinbase: boolean 是否为 coinbase 交易
            inputs: [   输入
                {
                    "pre_txid": string 前向交易哈希
                    "prev_addresses": [
                        "address1",
                    ]
                    "prev_position": int 前向交易的输出位置
                    "prev_value": string 前向交易输入金额
                    "coinbase": string coinbase 交易才有
                    "script_asm": string Script Asm
                    "script_hex": string Script Hex
                },
                {
                    "pre_txid": string 前向交易哈希
                    "addresses": Array<String> 输出地址
                    "prev_position": int 前向交易的输出位置
                    "prev_value": string 前向交易输入金额
                    "coinbase": string coinbase 交易才有
                    "script_asm": string Script Asm
                    "script_hex": string Script Hex
                }
            ],
            inputs_count: int 输入数量
            outputs: [ 输出
                {
                    "addresses": Array<String> 输出地址
                    "value": string 输出金额
                    "type": string 脚本类型
                    "next_txid": string 向后交易 hash
                    "next_position": string 向后交易 输出位置
                },
                {
                    "addresses": Array<String> 输出地址
                    "value": string 输出金额
                    "type": string 脚本类型
                    "next_txid": string 向后交易 hash
                    "next_position": string 向后交易 输出位置
                }
            ],
            outputs_count: int 输出数量
        },
    }
}
```

### 查询接口

请求:

GET HOST/res/btc/search/{*param*}

|参数名|类型|必须|备注|
| -----|----|----|----|
| param | url string | yes | 区块高度、区块哈希、交易哈希、地址|

响应:

```
{
    "code": 0,
    "err_msg": "",
    "content": {
        "coin": "btc",
        "type": "address",
        "param": "param"
    }
}
```
