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
                            <span v-if="payRemainTime" class="count-down">剩余支付时间{{`${Math.floor(this.payRemainTime / 60)}分${this.payRemainTime % 60}秒`}}</span>
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
                        <el-col :span="3">广告方</el-col>
                        <el-col :span="9">
                            {{currentResource.maker}}
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
                        <el-col :span="9">
                            {{paymentMethod}}
                        </el-col>
                        <el-col :span="3">{{lastUpdateLabel}}</el-col>
                        <el-col :span="9">
                            {{currentResource.complete_time | formatTime}}
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
                                    <el-col :span="3">申诉结果</el-col>
                                    <el-col :span="9">
                                        <span>{{appeal.result | itemText(appealResultTypes)}}</span>
                                        <span>{{appeal.order_result | itemText(orderResultTypes)}}</span>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">申诉人</el-col>
                                    <el-col :span="9">
                                        {{appealSide}}
                                    </el-col>
                                    <el-col :span="3">申诉方</el-col>
                                    <el-col :span="9">
                                        {{isSellerAppeal?'卖方':'买方'}}
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">申诉原因</el-col>
                                    <el-col :span="9">
                                        {{appeal.title}}
                                    </el-col>
                                    <el-col :span="3">申诉时间</el-col>
                                    <el-col :span="9">
                                        {{appeal.create_time | formatTime}}
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">申诉详情</el-col>
                                    <el-col :span="9">
                                        <span>{{appeal.detail}}</span>
                                    </el-col>
                                    <el-col :span="3">处理备注</el-col>
                                    <el-col :span="9">
                                        <span>{{appeal.remark}}</span>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col v-if="appeal.staff_id||appeal.operator" :span="3">处理人员</el-col>
                                    <el-col v-if="appeal.staff_id||appeal.operator" :span="9">
                                        <router-link :to="`/users/${appeal.operator.id}`">
                                            {{appeal.operator.name}}
                                        </router-link>
                                    </el-col>
                                    <el-col v-if="appeal.staff_id||appeal.operator" :span="3">处理时间</el-col>
                                    <el-col v-if="appeal.staff_id||appeal.operator" :span="9">
                                        {{appeal.update_time | formatTime}}
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div v-else>暂无申诉信息</div>
                    </el-card>
                </el-col>
                <el-col :span="12" class="with-padding-left">
                    <el-card>
                        <div class="appeal-wrapper">
                            <div v-if="appeal">
                                <div>当前处理中客服：<span class="staff">{{appeal.staff_id===0?'无客服':appeal.staff_name}}</span>
                                </div>
                                <div class="chat-actions">
                                    <el-button type="success" v-if="appeal.status==='created'" @click="processAppeal">
                                        处理申诉
                                    </el-button>
                                    <template v-if="appeal.status==='processing'">
                                        <el-button type="success" @click="joinChat" :disabled="joinedChat">
                                            加入聊天
                                        </el-button>
                                        <el-button type="success" v-if="joinedChat" @click="exitChat">
                                            退出聊天
                                        </el-button>
                                        <el-button type="warning" @click="suspendAppeal">
                                            挂起申诉
                                        </el-button>
                                        <el-button type="danger"
                                                   @click="showAppealDialog">
                                            处理完成
                                        </el-button>
                                    </template>

                                    <el-button type="warning" v-if="appeal.status==='pending'" @click="resumeAppeal">
                                        恢复处理
                                    </el-button>
                                </div>
                                <Chat v-if="joinedChat" :client="chat.imClient" :conversation-id="convId"
                                      :each-user-id="{ customer: `${user.account.id}`, buyer: `${currentResource.buy_user.id}`, seller: `${currentResource.sell_user.id}` }"
                                      :client-id="`${user.account.id}`"
                                      style="margin: 10px 0 0 0;border: solid 1px #ddd;"></Chat>
                                <div v-else>
                                    未加入聊天
                                </div>
                            </div>
                            <div v-else>未发起申诉，无法查看聊天内容</div>
                            <History :order="currentResource" :id="id" style="margin:21px 0 0 10px;"></History>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-dialog
                    title="处理申诉结果"
                    id="appeal-dialog"
                    :visible.sync="appealDialogVisible"
                    width="30%">
                <div v-if="currentResource">
                    订单状态：{{currentResource.status | itemText(orderStatusTypes)}}
                </div>
                <div class="title">申诉结果</div>
                <el-select v-model="appealResult" placeholder="请选择申诉结果" @change="selectAppealResult">
                    <el-option
                            v-for="(item,index) in appealResultTypes"
                            :key="item.value"
                            :label="item.text"
                            :value="item">
                    </el-option>
                </el-select>
                <template v-if="currentResource&&currentResource.status!=='success'">
                    <div class="title">订单处理结果</div>
                    <el-select v-model="orderResult" placeholder="请选择订单结果">
                        <!--取消申诉一一对应-->
                        <el-option
                                v-for="(item,index) in orderResultTypes"
                                :disabled="shouldDisableOrderResult(item)"
                                :key="item.value"
                                :label="item.text"
                                :value="item">
                        </el-option>
                    </el-select>
                </template>
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
    mapState,
  } from 'vuex';
  import {
    orderStatusTypes,
    paymentTypes,
    appealStatusTypes,
    appealResultTypes,
    orderResultTypes,
  } from '~/common/constants';
  import Chat from '~/components/chat';
  import History from './history';

  const ORDER_PAY_TIME = 15; // 15分钟（未换算）
  export default {
    components: {
      Chat,
      History,
    },
    data() {
      return {
        id: this.$route.params.id,
        appeal: null,
        appealStatusTypes,
        appealResultTypes,
        orderStatusTypes,
        orderResultTypes,
        appealResult: null,
        orderResult: null,
        appealRemark: null,
        payRemainTime: 0,
        orderExpireTime: 0,
        secondCountdown: null,
        appealDialogVisible: false,
        convId: '',
        joinedChat: false,
      };
    },
    computed: {
      ...mapState(['user', 'chat']),
      paymentMethod() {
        const pay = this.currentResource.payment_methods[0];
        return pay ? `${this.itemText(pay.method, paymentTypes)} 账号：${pay.account_no} 账户名：${pay.account_name}` : '--';
      },
      canCloseAppeal() {
        return this.appealResult && this.appealRemark && this.appealRemark.length >= 5;
      },
      lastUpdateLabel() {
        let label;
        switch (this.currentResource.status) {
          case 'cancel':
            label = '取消时间';
            break;
          case 'closed':
            label = '关闭时间';
            break;
          case 'success':
            label = '卖家收款时间';
            break;
          default:
            label = '更新时间';
        }
        return label;
      },
      isSellerAppeal() {
        return this.appeal.user_id === this.currentResource.sell_user.id;
      },
      appealSide() {
        return this.isSellerAppeal ? `${this.currentResource.sell_user.name}` : `${this.currentResource.buy_user.name}`;
      },
    },
    mounted() {
      this.initData();
    },
    beforeDestroy() {
      this.stopCountDown();
    },
    methods: {
      initData() {
        this.initSingleResource('orders', this.id, () => {
          const order = this.currentResource;
          this.convId = order.conversation_id; // 聊天对话id
          if (order.merchant_side === 'sell') {
            order.sell_user = order.merchant;
            order.buy_user = order.user;
            order.maker = '卖方';
          } else {
            order.sell_user = order.user;
            order.buy_user = order.merchant;
            order.maker = '买方';
          }
          if (order.status === 'created') {
            this.orderExpireTime = (order.place_time + ORDER_PAY_TIME * 60) * 1000;
            this.payRemainTime = Math.floor((this.orderExpireTime - Date.now()) / 1000);
            this.startCountDown();
          }
        });
        this.$axios.get(`orders/${this.id}/appeal`).then(response => {
          if (response.data.data) {
            this.appeal = response.data.data;
            if (this.appeal.staff_id === this.user.account.id) {
              this.joinedChat = true;
            }
          }
        });
      },
      processAppeal() {
        this.patchAppeal({'operation_type': 'process'});
      },
      suspendAppeal() {
        this.patchAppeal({'operation_type': 'suspend'});
      },
      resumeAppeal() {
        this.patchAppeal({'operation_type': 'resume'});
      },
      showAppealDialog() {
        this.appealDialogVisible = true;
      },
      closeAppeal() {
        this.appealDialogVisible = false;
        this.joinedChat = false;
        this.patchAppeal({
          operation_type: 'close',
          appeal_result: this.appealResult.value,
          order_result: this.orderResult.value,
          remark: this.appealRemark
        });
      },
      joinChat() {
        this.$axios.get(`orders/${this.id}/appeal`).then(response => {
          if (response.data.data) {
            this.appeal = response.data.data;
            if (!this.joinedChat && this.appeal.staff_id === 0) {
              this.$axios.post(`orders/${this.id}/conversation`).then(response => {
                this.joinedChat = true;
                this.appeal.staff_id = this.user.account.id;
                this.appeal.staff_name = this.user.account.name;
                this.$message('成功加入聊天', 'success');
              });
            } else if (this.appeal.staff_id !== this.user.account.id) {
              this.$confirm('该会话已有客服正在处理中，继续加入将导致当前客服退出会话。是否确认加入聊天？', '确认加入聊天',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  center: true
                }
              ).then(() => {
                this.$axios.post(`orders/${this.id}/conversation`).then(response => {
                  this.joinedChat = true;
                  this.appeal.staff_id = this.user.account.id;
                  this.appeal.staff_name = this.user.account.name;
                  this.$message('成功加入聊天', 'success');
                });
              }).catch(() => {
                this.$message('取消加入聊天');
              });
            }
          }
        });
      },
      exitChat() {
        this.$axios.delete(`orders/${this.id}/conversation`).then(response => {
          console.log(response);
          if (response.data.data && !response.data.data.staff_id) {
            this.joinedChat = false;
            this.appeal.staff_id = 0;
            this.appeal.staff_name = '';
            this.$message('已经退出聊天');
          } else {
            this.$message('退出聊天出错，请刷新页面重试或联系开发人员', 'error');
          }
        });
      },
      patchAppeal(payload) {
        this.$axios.patch(`/orders/${this.id}/appeal`, payload).then(response => {
          this.appeal = response.data.data;
        });
      },
      startCountDown() {
        this.secondCountdown = setInterval(() => {
          if (this.payRemainTime > 0) {
            this.payRemainTime = Math.floor((this.orderExpireTime - Date.now()) / 1000);
          } else {
            this.stopCountDown();
          }
        }, 1000);
      },
      stopCountDown() {
        if (!this.secondCountdown) return;
        clearInterval(this.secondCountdown);
      },
      selectAppealResult(selected) {
        // 暂时不用了
        if (this.currentResource.status === 'success') {
          this.orderResult = this.orderResultTypes.find(r => r.value === 'none');// 已完成的后端不能操作
        } else {
          this.orderResult = null;
        }
      },
      shouldDisableOrderResult(item) {
        return (this.appealResult && this.appealResult.value !== 'draw' && item.value === 'none') || (this.appealResult && this.appealResult.value === 'draw' && item.value === 'receipt_order');
      }
    }
  };
</script>
<style lang="scss">
    .page-order-detail {
        .count-down {
            color: #e35555;
        }
        .appeal-status {
            &.created {

                color: #e35555;

            }
            &.processing {
                color: #52cbca;

            }
        }
        .appeal-wrapper {
            display: flex;
            justify-content: flex-start;
            .staff {
                color: #e35555;
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

    .el-message-box__message p {
        text-align: left;
    }

</style>
