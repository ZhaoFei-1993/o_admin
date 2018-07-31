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
                        <div class="info-block" v-if="currentResource && appeal">
                            <div class="info-header">申诉信息</div>
                            <div class="appeal-info-container">

                                <el-row>
                                    <el-col :span="3">申诉状态</el-col>
                                    <el-col :span="9" :class="[appeal.status,'appeal-status']">
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

                            </div>

                        </div>
                        <div v-else>暂无申诉信息</div>
                    </el-card>
                </el-col>
                <el-col :span="12" class="with-padding-left">
                    <el-card v-if="appeal">
                        <div class="chat-actions">
                            <el-button type="success" v-if="appeal.status==='created'" @click="processAppeal">
                                处理申诉
                            </el-button>
                            <el-button type="warning" v-if="appeal.status==='processing'" @click="suspendAppeal">
                                挂起申诉
                            </el-button>
                            <el-button type="danger" v-if="appeal.status==='processing'"
                                       @click="showAppealDialog">
                                处理完成
                            </el-button>
                            <el-button type="warning" v-if="appeal.status==='pending'" @click="resumeAppeal">
                                恢复处理
                            </el-button>
                        </div>
                        <Chat :client="chat.imClient" :conversation-id="convId"
                              :client-id="`${user.account.id}`"></Chat>
                    </el-card>
                    <el-card v-else>
                        未发起申诉，无法查看聊天内容
                    </el-card>
                </el-col>
            </el-row>
            <el-dialog
                    title="处理申诉结果"
                    id="appeal-dialog"
                    :visible.sync="appealDialogVisible"
                    width="30%">
                <div class="title">申诉结果</div>
                <el-select v-model="appealResultIndex" placeholder="请选择申诉结果">
                    <el-option
                            v-for="(item,index) in appealResultTypes"
                            :key="item.value"
                            :label="item.text"
                            :value="index">
                    </el-option>
                </el-select>
                <div class="title">订单处理结果</div>
                <div class="order-result" v-if="currentResource.status==='success'">
                    {{orderResultTypes[0].text}}
                </div>
                <div class="order-result" v-else>
                    {{orderResultTypes[appealResultIndex].text}}
                </div>

                <div class="title">申诉处理备注</div>
                <el-input :rows="4" type="textarea" placeholder="请填写申诉审核判定依据，方便追溯"
                          v-model="appealRemark"></el-input>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="appealDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="closeAppeal"
                               :disabled="!canCloseAppeal">确 定
                    </el-button>
                </div>
            </el-dialog>
        </template>
        <template v-else>
            <h4>加载中</h4>
        </template>

    </div>
</template>
<script>
  import {
    mapState
  } from "vuex";
  import {
    orderStatusTypes,
    paymentTypes,
    appealStatusTypes,
    appealResultTypes,
    orderResultTypes
  } from "~/common/constants";
  import Chat from '~/components/chat'

  export default {
    components: {
      Chat,
    },
    data() {
      return {
        id: this.$route.params.id,
        appeal: null,
        appealStatusTypes,
        appealResultTypes,
        orderStatusTypes,
        orderResultTypes,
        appealResultIndex: null,
        appealRemark: null,
        orderResult: null,
        appealDialogVisible: false,
        convId: '',
      }
    },
    computed: {
      ...mapState(['user', 'chat']),
      paymentMethod() {
        const pay = this.currentResource.payment_method
        return pay ? `${this.itemText(pay.method, paymentTypes)} 账号：${pay.account_no} 账户名：${pay.account_name}` : '--'
      },
      canCloseAppeal() {
        return this.appealResultIndex >= 0 && this.orderResult && this.appealRemark && this.appealRemark.length >= 5
      }
    },
    mounted() {
      this.initData();
    },
    methods: {
      initData() {
        this.initCurrentResource('orders', this.id, () => {
          const order = this.currentResource;
          this.convId = order.conversation_id // 聊天对话id
          if (order.merchant_side === 'sell') {
            order.sell_user = order.merchant
            order.buy_user = order.user
          } else {
            order.sell_user = order.user
            order.buy_user = order.merchant
          }
        });
        this.$axios.get(`orders/${this.id}/appeal`).then(response => {
          if (response.data.data) {

            this.appeal = response.data.data
          }
        })
      },
      appealSide(appeal) {
        return appeal.user_id === this.currentResource.sell_user.id ? `卖家:${this.currentResource.sell_user.name}` : `买家:${this.currentResource.buy_user.name}`
      },
      processAppeal() {
        this.patchAppeal({"operation_type": "process",})
        this.joinChat()
      },
      suspendAppeal() {
        this.patchAppeal({"operation_type": "suspend",})
        this.exitChat()
      },
      resumeAppeal() {
        this.patchAppeal({"operation_type": "resume",})
        this.joinChat()
      },
      showAppealDialog() {
        if (this.currentResource.status === 'success') {
          this.orderResult = this.orderResultTypes[0].value
        }
        this.appealDialogVisible = true
      },
      closeAppeal() {
        this.appealDialogVisible = false;
        this.patchAppeal({
          operation_type: "close",
          appeal_result: this.appealResultTypes[this.appealResultIndex].value,
          order_result: this.orderResult,
          remark: this.appealRemark
        })
        this.exitChat()
      },
      joinChat() {
        this.$axios.post(`orders/${this.id}/conversation`).then(response => {
          this.$message('成功加入聊天', 'success')
        })
      },
      exitChat() {
        this.$axios.delete(`orders/${this.id}/conversation`).then(response => {
          this.$message('已经退出聊天')
        })
      },
      patchAppeal(payload) {
        this.$axios.patch(`/orders/${this.id}/appeal`, payload).then(response => {
          this.appeal = response.data.data
        })
      }
    }
  }
</script>
<style lang="scss">
    .page-order-detail {
        .appeal-status {
            &.created {

                color: #e35555;

            }
            &.processing {
                color: #52cbca;

            }
        }
        #appeal-dialog {
            .el-select {
                width: 100%;
                margin-bottom: 0.5rem;
            }
            .title {
                margin-top: 1rem;
                font-weight: bold;
            }
        }
    }


</style>