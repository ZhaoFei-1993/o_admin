<template>
    <div class="main-content page-order-detail">
        <h1>订单详情 --- {{currentResourceId}}</h1>
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
                            {{orderStatus}}
                        </el-col>
                        <el-col :span="3">下单时间</el-col>
                        <el-col :span="9">
                            {{currentResource.create_time | formatTime}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">买家</el-col>
                        <el-col :span="9">
                            <router-link :to="`/users/${currentResource.user_id}`">{{currentResource.user_id}}
                            </router-link>
                        </el-col>
                        <el-col :span="3">卖家</el-col>
                        <el-col :span="9">
                            <router-link :to="`/users/${currentResource.merchant_id}`">{{currentResource.merchant_id}}
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
                <el-col :span="12">
                    <el-card>
                        <div class="info-block" v-if="appeal">
                            <div class="info-header">申诉信息</div>
                            <el-row>
                                <el-col :span="3">申诉状态</el-col>
                                <el-col :span="9">
                                    {{currentResource.id}}
                                </el-col>
                                <el-col :span="3">关联广告</el-col>
                                <el-col :span="9">
                                    <router-link :to="`items/${currentResource.item_id}`">{{currentResource.item_id}}
                                    </router-link>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-else>暂无申诉信息</div>
                    </el-card>
                </el-col>
                <el-col :span="12">
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
  import {orderStatusTypes, paymentTypes} from "~/common/constants";
  import {itemText} from "~/common/utilities";

  export default {
    components: {},
    data() {
      return {
        id: this.$route.params.id,
        appeal: null,
      }
    },
    computed: {
      orderStatus() {
        return itemText(this.currentResource.status, orderStatusTypes)
      },
      paymentMethod() {
        const pay = this.currentResource.pay_method
        return pay ? `${itemText(pay.method, paymentTypes)} 账号：${pay.account_no} 账户名：${pay.account_name}` : '--'
      }
    },
    mounted() {
      this.initData();
    },
    methods: {
      initData() {
        this.initCurrentResource('orders', this.id,);
      },
    }
  }
</script>