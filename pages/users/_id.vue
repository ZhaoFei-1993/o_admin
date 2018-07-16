<template>
    <div class="main-content page-user-detail">
        <template v-if="currentResource">
            <el-tabs type="border-card" v-model="currentTab">
                <el-tab-pane label="基本信息" name="basic">
                    <div class="info-block">
                        <div class="info-header">账户信息</div>
                        <el-row>
                            <el-col :span="3">用户ID</el-col>
                            <el-col :span="9">{{currentResource.id}}</el-col>
                            <el-col :span="3">账号状态</el-col>
                            <el-col :span="9" :class="currentResource.status">
                                {{userStatus}}
                                <el-button type="danger" @click="toggleStatus()">
                                    {{currentResource.status==='normal'?'限制交易':'取消限制'}}
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">昵称</el-col>
                            <el-col :span="9">{{currentResource.name}}</el-col>
                            <el-col :span="3">角色</el-col>
                            <el-col :span="9">
                                <el-tag v-if="currentResource.role==='merchant'" type="success">认证商家</el-tag>
                                <div v-else>
                                    <el-tag type="info">普通用户</el-tag>
                                    <el-button type="danger" v-if="isSuperAdmin" @click="markAsMerchant">设为认证商家（管理员特权）
                                    </el-button>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">实名状态</el-col>
                            <el-col :span="9">
                                {{kycStatus}}
                            </el-col>
                            <el-col :span="3">真实姓名</el-col>
                            <el-col :span="9">{{currentResource.kyc_name || '未实名'}}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">手机</el-col>
                            <el-col :span="9">
                                {{currentResource.mobile}}
                            </el-col>
                            <el-col :span="3">邮箱</el-col>
                            <el-col :span="9">{{currentResource.email}}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">激活时间</el-col>
                            <el-col :span="9">
                                {{currentResource.create_time | formatTime}}
                            </el-col>
                            <el-col :span="3">更新时间</el-col>
                            <el-col :span="9">
                                {{currentResource.update_time | formatTime}}
                            </el-col>

                        </el-row>

                    </div>
                    <div class="info-block" v-if="balance">
                        <div class="info-header">资产信息</div>
                        <el-table
                                :data="balance">
                            <el-table-column
                                    prop="coin_type"
                                    label="币种">
                            </el-table-column>
                            <el-table-column
                                    prop="available"
                                    label="可用余额">
                            </el-table-column>
                            <el-table-column
                                    prop="frozen"
                                    label="冻结余额">
                            </el-table-column>
                            <el-table-column
                                    prop="total"
                                    label="总余额">
                            </el-table-column>
                        </el-table>
                    </div>


                </el-tab-pane>
                <el-tab-pane label="商家信息" name="merchant">
                    <div class="info-block" v-if="merchant">
                        <div class="info-header">商家认证</div>
                        <el-row>
                            <el-col :span="3">认证状态</el-col>
                            <el-col :span="9">
                                {{merchantStatus}}
                            </el-col>
                            <el-col :span="3">认证时间</el-col>
                            <el-col :span="9">
                                {{merchant.auth_time | formatTime}}
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">发布广告</el-col>
                            <el-col :span="9">
                                {{merchant.guaranty_amount}}
                            </el-col>
                            <el-col :span="3">是否接单</el-col>
                            <el-col :span="9">
                                {{merchant.is_available?"是":"否"}}
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">微信</el-col>
                            <el-col :span="9">{{merchant.wechat}}</el-col>
                        </el-row>
                    </div>
                    <div class="info-block" v-if="setting">
                        <div class="info-header">交易设置</div>
                        <el-row>
                            <el-col :span="3">最小交易额</el-col>
                            <el-col :span="9">
                                {{setting.min_deal_cash_amount}}
                            </el-col>
                            <el-col :span="3">最大交易额</el-col>
                            <el-col :span="9">
                                {{setting.max_deal_cash_amount}}
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">法币类型</el-col>
                            <el-col :span="9">
                                {{setting.cash_type}}
                            </el-col>
                            <el-col :span="3">交易对手限制</el-col>
                            <el-col :span="9">
                                {{counterparty_limit}}
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">自动回复</el-col>
                            <el-col :span="21">{{setting.auto_reply_content}}</el-col>
                        </el-row>
                    </div>
                    <div class="info-block" v-if="paymentMethods">
                        <div class="info-header">支付方式</div>
                        <el-table
                                :data="paymentMethods">
                            <el-table-column
                                    prop="method"
                                    label="收款方式">
                            </el-table-column>
                            <el-table-column
                                    prop="account_name"
                                    label="账户名">
                            </el-table-column>
                            <el-table-column
                                    prop="account_no"
                                    label="账号">
                            </el-table-column>
                            <el-table-column
                                    prop="qr_code_image"
                                    label="二维码">
                            </el-table-column>
                            <el-table-column
                                    prop="detail"
                                    label="收款详情">
                            </el-table-column>
                            <el-table-column
                                    prop="status"
                                    label="状态">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>


        </template>
        <div v-else>加载中</div>
    </div>
</template>
<script>
  import {userStatusTypes, roles, kycStatusTypes} from '~/common/constants'

  export default {
    data() {
      return {
        id: this.$route.params.id,
        currentTab: 'basic',
        balance: [
          {
            "coin_type": "BTC",             // 币种
            "available": "100.00000000",    // 可用余额
            "frozen": "20.00000000",        // 冻结中余额
            "total": "80.00000000"          // 总余额
          },
          {
            "coin_type": "BCH",             // 币种
            "available": "100.00000000",    // 可用余额
            "frozen": "20.00000000",        // 冻结中余额
            "total": "80.00000000"          // 总余额
          },
          {
            "coin_type": "ETH",             // 币种
            "available": "100.00000000",    // 可用余额
            "frozen": "20.00000000",        // 冻结中余额
            "total": "80.00000000"          // 总余额
          },
          {
            "coin_type": "USDT",             // 币种
            "available": "100.00000000",    // 可用余额
            "frozen": "20.00000000",        // 冻结中余额
            "total": "80.00000000"          // 总余额
          },
        ],
        merchant: {},
        setting: {},
        paymentMethods: [],
      }
    },
    mounted() {
      this.initCurrentResource('users', this.id);
    },
    computed: {
      userStatus() {
        const status = userStatusTypes.find(r => r.name === this.currentResource.status)
        return status ? (status.text) : '--'
      },
      kycStatus() {
        const status = kycStatusTypes.find(r => r.name === this.currentResource.kyc_status)
        return status ? (status.text) : '--'
      },
      merchantStatus() {
        return 'TODO'
        // const status = kycStatusTypes.find(r => r.name === this.currentResource.kyc_status)
        // return status ? (status.text) : '--'
      },
      counterparty_limit() {
        return '' + this.setting.counterparty_limit
      },
      isSuperAdmin() {
        return Math.random() < 0.5
      },
    },
    methods: {
      toggleStatus() {
        this.$confirm(this.currentResource.status === 'forbidden' ? `确认解除用户 ${this.currentResource.name} 交易限制?` : `确认限制用户 ${this.currentResource.name} 交易?`, '改变用户状态', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // TODO
        });
      },
      markAsMerchant() {
        this.$confirm(`确认以超级管理员权限将此用户 ${this.currentResource.name} 设置为认证商家?`, '认证商家提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // TODO
        });
      }
    }
  }
</script>
<style lang="scss">
    @import "~assets/style/global.scss";

    .page-user-detail {
        .el-tabs__item {
            font-size: 20px;
            font-weight: bold;
        }
        .info-block {
            margin-bottom: 2rem;
            .info-header {
                color: $color-primary;
                font-size: 18px;
                margin-bottom: 0.5rem;
            }

            .el-row {
                border-bottom: 1px solid #eeeeee;
                padding: 0.5rem;
                &:nth-of-type(even) {
                    background-color: #f5f5f5;
                }
                .el-col {
                    &:nth-of-type(odd) {
                        font-weight: bold;
                    }
                    height: 40px;
                    line-height: 40px;
                }
                .el-button {
                    margin: 0 0.5rem;
                }
            }

        }

    }
</style>