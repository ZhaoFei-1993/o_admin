<template>
    <div class="main-content page-order-detail">
        <template v-if="currentResource">
            <el-card class="order-info">
                <div class="info-block">
                    <div class="info-header">订单信息</div>
                    <el-row>
                        <el-col :span="3">订单ID</el-col>
                        <el-col :span="9">
                            {{currentResource.id}}
                        </el-col>
                        <el-col :span="3">关联广告</el-col>
                        <el-col :span="9">
                            <router-link :to="`/items/${currentResource.item_id}`">{{currentResource.item_id}}
                            </router-link>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">订单状态</el-col>
                        <el-col :span="9">
                            {{currentResource.status | itemText(orderStatusTypes)}}
                        </el-col>
                        <el-col :span="3">下单时间</el-col>
                        <el-col :span="9">
                            {{currentResource.create_time | formatTime}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">买家</el-col>
                        <el-col :span="9">
                            <router-link :to="`/users/${currentResource.buy_user.id}`">{{currentResource.buy_user.name}}
                            </router-link>
                        </el-col>
                        <el-col :span="3">卖家</el-col>
                        <el-col :span="9">
                            <router-link :to="`/users/${currentResource.sell_user.id}`">
                                {{currentResource.sell_user.name}}
                            </router-link>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">买家确认付款时间</el-col>
                        <el-col :span="9">
                            {{currentResource.pay_time | formatTime}}
                        </el-col>
                        <el-col :span="3">卖家确认收款时间</el-col>
                        <el-col :span="9">
                            {{currentResource.complete_time | formatTime}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">币种</el-col>
                        <el-col :span="9">
                            {{currentResource.coin_type}}
                        </el-col>
                        <el-col :span="3">数量</el-col>
                        <el-col :span="9">
                            {{currentResource.coin_amount}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">价格</el-col>
                        <el-col :span="9">
                            {{currentResource.price}}
                        </el-col>
                        <el-col :span="3">总价</el-col>
                        <el-col :span="9">
                            {{currentResource.cash_amount + ' '+ currentResource.cash_type}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">支付方式</el-col>
                        <el-col :span="21">
                            {{paymentMethod}}
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-row class="with-margin-top">
                <el-col :span="12" class="with-padding-righti">
                    <el-card>
                        <div class="info-block" v-if="currentResource && appeals&&appeals.length">
                            <div class="info-header">申诉信息</div>
                            <div class="appeal-info-container">
                                <el-collapse v-model="activeAppeals">
                                    <el-collapse-item v-for="appeal of appeals"
                                                      :title="appeal.status| itemText(appealStatusTypes)"
                                                      :name="appeal.id" :key="appeal.id"
                                                      :class="[appeal.status,'appeal-header']">
                                        <el-row>
                                            <el-col :span="3">申诉状态</el-col>
                                            <el-col :span="9">
                                                {{appeal.status | itemText(appealStatusTypes)}}
                                            </el-col>
                                            <el-col :span="3">申诉时间</el-col>
                                            <el-col :span="9">
                                                {{appeal.create_time | formatTime}}
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="3">申诉原因</el-col>
                                            <el-col :span="9">
                                                {{appeal.title}}
                                            </el-col>
                                            <el-col :span="3">申诉详情</el-col>
                                            <el-col :span="9">
                                                <span>{{appeal.detail}}</span>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="3">申诉方</el-col>
                                            <el-col :span="9">
                                                {{appealSide(appeal)}}
                                            </el-col>
                                            <el-col :span="3">申诉结果</el-col>
                                            <el-col :span="9">
                                                <span>{{appeal.result | itemText(appealResultTypes)}}</span>
                                            </el-col>
                                        </el-row>
                                    </el-collapse-item>
                                </el-collapse>
                            </div>

                        </div>
                        <div v-else>暂无申诉信息</div>
                    </el-card>
                </el-col>
                <el-col :span="12" class="with-padding-left">
                    <el-card>IM</el-card>
                </el-col>
            </el-row>
        </template>
        <template v-else>
            <h4>加载中</h4>
        </template>
    </div>
</template>
<script>
  import {orderStatusTypes, paymentTypes, appealStatusTypes, appealResultTypes} from "~/common/constants";

  export default {
    components: {},
    data() {
      return {
        id: this.$route.params.id,
        appeals: null,
        activeAppeals: null,
        appealStatusTypes,
        appealResultTypes,
        orderStatusTypes,
      }
    },
    computed: {
      paymentMethod() {
        const pay = this.currentResource.payment_method
        return pay ? `${this.itemText(pay.method, paymentTypes)} 账号：${pay.account_no} 账户名：${pay.account_name}` : '--'
      }
    },
    mounted() {
      this.initData();
    },
    methods: {
      initData() {
        this.initCurrentResource('orders', this.id, () => {
          const order = this.currentResource;
          if (order.merchant_side === 'sell') {
            order.sell_user = order.merchant
            order.buy_user = order.user
          } else {
            order.sell_user = order.user
            order.buy_user = order.merchant
          }
        });
        this.$axios.get(`orders/${this.id}/appeal`).then(response => {
          this.appeals = [response.data.data] // 暂时后端只支持一个appeal
          this.activeAppeals = this.appeals[0].id
        })
      },
      appealSide(appeal) {
        return appeal.user_id === this.currentResource.sell_user.id ? `卖家:${this.currentResource.sell_user.name}` : `买家:${this.currentResource.buy_user.name}`
      },
    }
  }
</script>
<style lang="scss">
    .page-order-detail {
        .appeal-header {
            &.created {
                .el-collapse-item__header {
                    color: white;
                    background-color: #e35555;
                }
            }
            &.processing {
                .el-collapse-item__header {
                    color: white;
                    background-color: #52cbca;
                }
            }
        }
    }


</style>