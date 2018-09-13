<template>
    <div class="main-content page-user-detail">
        <template v-if="currentResource">
            <div class="shortcuts">
                快捷查看该用户的：
                <router-link :to="'/items?user_search='+currentResource.id">
                    <el-button type="primary" class="view-detail">广告</el-button>
                </router-link>
                <router-link :to="'/orders?user_id='+currentResource.id">
                    <el-button type="primary" class="view-detail">订单</el-button>
                </router-link>
                <router-link :to="'/operations/appeals?user_search='+currentResource.id">
                    <el-button type="primary" class="view-detail">申诉</el-button>
                </router-link>
            </div>
            <div class="with-margin-top today-limit" v-if="userLimit">
                <div>
                    当日违规限制交易
                    <span v-if="userLimit.day_limit">
                        已限制
                        <el-button type="warning" @click="cancelUserLimit('day_limit')">
                            恢复交易权限
                        </el-button>
                    </span>
                    <span v-else>未限制</span>
                </div>
                <div class="with-margin-top">
                    30天违规限制交易
                    <span v-if="userLimit.month_limit">
                        已限制
                        <el-button type="warning" @click="cancelUserLimit('month_limit')">
                            恢复交易权限
                        </el-button>
                    </span>
                    <span v-else>未限制</span>
                </div>
            </div>
            <el-tabs type="border-card" v-model="currentTab" @tab-click="tabClick" class="with-margin-top">
                <el-tab-pane label="基本信息" name="basic">
                    <div class="info-block">
                        <div class="info-header">账户信息</div>
                        <el-row>
                            <el-col :span="3">用户ID</el-col>
                            <el-col :span="9">{{currentResource.id}}</el-col>
                            <el-col :span="3">账号状态</el-col>
                            <el-col :span="9" :class="currentResource.status">
                                {{currentResource.status | itemText(userStatusTypes)}}
                                <el-button v-if="currentResource.status==='normal'" type="danger"
                                           @click="forbidUser"
                                >
                                    限制交易
                                </el-button>
                                <el-button v-else type="danger" @click="allowUser" class="float-right">
                                    取消限制
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">昵称</el-col>
                            <el-col :span="9">
                                <span>{{currentResource.name}}</span>
                                <el-button type="danger" @click="changeName"
                                           class="float-right">修改昵称
                                </el-button>
                            </el-col>
                            <el-col :span="3">角色</el-col>
                            <el-col :span="9">
                                <el-tag v-if="currentResource.role==='merchant'" type="success">认证商家</el-tag>
                                <div v-else>
                                    <el-tag type="info">普通用户</el-tag>
                                    <el-button type="danger" v-if="isSuperAdmin" @click="markAsMerchant"
                                               class="float-right">设为认证商家
                                    </el-button>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">实名状态</el-col>
                            <el-col :span="9">
                                {{currentResource.kyc_status |itemText(kycStatusTypes)}}
                            </el-col>
                            <el-col :span="3">真实姓名</el-col>
                            <el-col :span="9">{{kycName}}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">证件类型</el-col>
                            <el-col :span="9">
                                {{kycLicense}}
                            </el-col>
                            <el-col :span="3">证件号</el-col>
                            <el-col :span="9">{{kycNumber}}</el-col>
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
                            <el-table-column :key="index"
                                             v-for="(column, index) in balanceColumns"
                                             :prop="column.prop"
                                             :label="column.label"
                                             :formatter="column.formatter"
                                             :sortable="column.sortable"
                                             :class-name="column.className"
                                             :sort-method="column.sortMethod"
                                             :min-width="column.width">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="info-block" v-if="balanceHistory">
                        <div class="info-header">资产流水</div>
                        <el-table
                                :data="balanceHistory">
                            <el-table-column :key="index"
                                             v-for="(column, index) in balanceHistoryColumns"
                                             :prop="column.prop"
                                             :label="column.label"
                                             :formatter="column.formatter"
                                             :sortable="column.sortable"
                                             :class-name="column.className"
                                             :sort-method="column.sortMethod"
                                             :min-width="column.width">
                            </el-table-column>
                        </el-table>
                        <el-pagination
                                class="with-margin-top"
                                background
                                v-if="historyTotalNum>0"
                                layout="prev, pager, next"
                                @current-change="getBalanceHistory"
                                :current-page.sync="historyPageNum"
                                :total="historyTotalNum">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="商家信息" name="merchant">
                    <div class="info-block" v-if="merchant">
                        <div class="info-header">商家详情</div>
                        <el-row>
                            <el-col :span="3">是否接单</el-col>
                            <el-col :span="9">
                                {{merchant.is_available?"是":"否"}}
                            </el-col>
                            <el-col :span="3">商家状态</el-col>
                            <el-col :span="9">
                                {{merchant.status | itemText(merchantStatusTypes)}}
                                <el-button v-if="merchant.status==='normal'" type="danger"
                                           @click="forbidMerchant">
                                    限制发布广告
                                </el-button>
                                <el-button v-else type="danger" @click="allowMerchant">
                                    取消限制
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">认证状态</el-col>
                            <el-col :span="9">
                                {{merchant.auth_status | itemText(merchantAuthStatusTypes)}}
                            </el-col>
                            <el-col :span="3">认证时间</el-col>
                            <el-col :span="9">
                                {{merchant.auth_time | formatTime}}
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">保证金</el-col>
                            <el-col :span="9">
                                {{merchant.guaranty_amount}}
                            </el-col>
                            <el-col :span="3">微信</el-col>
                            <el-col :span="9">{{merchant.wechat}}</el-col>
                        </el-row>

                    </div>
                    <div class="info-block" v-else>
                        <div class="info-header">商家详情</div>
                        该用户尚未提交商家认证申请
                    </div>
                    <div class="info-block" v-if="setting">
                        <div class="info-header">广告设置</div>
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
                                {{counterpartyLimit}}
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">自动回复</el-col>
                            <el-col :span="21">{{setting.auto_reply_content}}</el-col>
                        </el-row>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="交易信息" name="transaction">
                    <div class="info-block">
                        <div class="info-header">最近30天交易</div>
                        <el-table :data="userExtra">
                            <el-table-column prop="deal_count" label="实际成交订单数"></el-table-column>
                            <el-table-column prop="order_count" label="总订单数"></el-table-column>
                            <el-table-column prop="order_count" label="完成率">
                                <template slot-scope="scope">
                                    {{ (scope.row.deal_count/scope.row.order_count) | percentage}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="pay_time" label="平均付款时间">
                                <template slot-scope="scope">
                                    {{ scope.row.pay_time | formatDuration}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="receipt_time" label="平均放行时间">
                                <template slot-scope="scope">
                                    {{ scope.row.receipt_time | formatDuration}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="total_appeal" label="申诉数"></el-table-column>
                            <el-table-column prop="lose_appeal" label="败诉数"></el-table-column>
                        </el-table>
                    </div>
                    <div class="info-block" v-if="paymentMethods">
                        <div class="info-header">支付方式</div>
                        <el-table
                                :data="paymentMethods">
                            <el-table-column
                                    prop="method"
                                    label="收款方式">
                                <template slot-scope="scope">
                                    {{ scope.row.method | itemText(paymentTypes)}}
                                </template>
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
                                    label="二维码"
                                    :width="200">
                                <template slot-scope="scope">
                                    <img v-if="scope.row.qr_code_image" :src="scope.row.qr_code_image"
                                         class="qrcode-image"/>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="status"
                                    label="状态">
                                <template slot-scope="scope">
                                    {{scope.row.status | itemText(paymentStatusTypes)}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="操作记录" name="operation">
                    <el-table :data="userOperations">
                        <el-table-column prop="create_time" label="操作时间">
                            <template slot-scope="scope">
                                {{scope.row.create_time |formatTime}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator" label="操作人">
                            <template slot-scope="scope">
                                <span v-if="scope.row.operator_id===0">系统</span>
                                <router-link v-else :to="'/users/'+scope.row.operator_id" class="keep-short-string">
                                    {{scope.row.operator}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operation" label="操作类型">
                            <template slot-scope="scope">
                                {{scope.row.operation|itemText(operationTypes)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注信息"></el-table-column>
                    </el-table>
                    <no-ssr>
                        <el-pagination
                                class="with-margin-top"
                                background
                                layout="prev, pager, next"
                                @current-change="changeOperationPage"
                                :current-page.sync="operationsPage"
                                :total="operationsTotal">
                        </el-pagination>
                    </no-ssr>
                </el-tab-pane>
            </el-tabs>
            <el-dialog
                    :title="constraintDialogProps.title"
                    :visible.sync="constraintDialogProps.dialogVisible"
                    width="30%">
                <p>{{constraintDialogProps.content}}</p>
                <el-input :rows="4" type="textarea" placeholder="请填写原因"
                          v-model="constraintDialogProps.remark"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="constraintDialogProps.dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmToggleConstraint"
                               :disabled="!constraintDialogProps.remark||constraintDialogProps.remark.length<5">确 定
                    </el-button>
                </div>
            </el-dialog>

            <el-dialog
                    title="修改用户昵称"
                    :visible.sync="changeNameDialogVisible"
                    width="30%">
                <p>修改用户'{{currentResource.name}}'的昵称</p>
                <el-input placeholder="请填2-15个字符的昵称"
                          v-model="newName"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="changeNameDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmChangeName"
                               :disabled="newName.length<2||newName.length>15">确 定
                    </el-button>
                </div>
            </el-dialog>

        </template>
        <div v-else>加载中</div>

    </div>

</template>
<script>
  import {
    userStatusTypes, kycStatusTypes, merchantAuthStatusTypes,
    merchantStatusTypes, counterpartyLimitTypes,
    balanceHistoryTypes, paymentTypes,
    licenseTypes, paymentStatusTypes,
    operationTypes,
  } from '~/common/constants';
  import {findMatchedItems} from '~/common/utilities';
  import {timeToLocale} from '../../common/utilities';

  export default {
    data() {
      return {
        kycStatusTypes,
        userStatusTypes,
        paymentTypes,
        merchantAuthStatusTypes,
        merchantStatusTypes,
        balanceHistoryTypes,
        licenseTypes,
        paymentStatusTypes,
        operationTypes,
        id: this.$route.params.id,
        currentTab: this.$route.query.tab || 'basic',
        balance: [],
        balanceHistory: [],
        merchant: null,
        setting: null,
        paymentMethods: [],
        forbidUserRemark: null,
        forbidUserDialogVisible: false,
        forbidMerchantRemark: null,
        forbidMerchantDialogVisible: false,
        historyTotalNum: 0,
        historyPageNum: 1,
        changeNameDialogVisible: false,
        newName: '',
        userLimit: {},
        constraintDialogProps: {
          title: '',
          content: '',
          remark: '',
          dialogVisible: false,
          constraint: '',
        },
        balanceColumns: [{
          prop: 'coin_type',
          label: '币种',
        }, {
          prop: 'available',
          label: '可用余额',
          formatter: (row, col, value) => {
            value.formatMoney();
            return value;
          }
        }, {
          prop: 'frozen',
          label: '冻结余额',
          formatter: (row, col, value) => {
            value.formatMoney();
            return value;
          }
        }, {
          prop: 'total',
          label: '总额',
          formatter: (row, col, value) => {
            value.formatMoney();
            return value;
          }
        }],
        balanceHistoryColumns: [{
          prop: 'coin_type',
          label: '币种',
        }, {
          prop: 'create_time',
          label: '时间',
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue);
          },
        }, {
          prop: 'business_type',
          label: '流水类型',
          formatter: (row, col, value) => {
            return this.itemText(value, balanceHistoryTypes);
          }
        }, {
          prop: 'amount',
          label: '金额数量',
          formatter: (row, col, value) => {
            return value;
          }
        }],
        userOperations: [],
        operationsPage: 1,
        operationsTotal: 10,
        userExtra: [],
      };
    },
    mounted() {
      this.getUserInfo();
      this.getUserLimit();
      this.getUserOperations();
    },
    computed: {
      counterpartyLimit() {
        return findMatchedItems(this.setting.counterparty_limit, counterpartyLimitTypes).map(o => o.text).join(', ');
      },
      kycName() {
        return this.currentResource.user_kyc ? (this.currentResource.user_kyc.last_name + '' + this.currentResource.user_kyc.first_name) : '--';
      },
      kycLicense() {
        return this.currentResource.user_kyc ? this.itemText(this.currentResource.user_kyc.id_type, this.licenseTypes) : '--';
      },
      kycNumber() {
        return this.currentResource.user_kyc ? (this.currentResource.user_kyc.id_number) : '--';
      }
    },
    methods: {
      getUserInfo() {
        this.initSingleResource('users', this.id, () => {
          this.currentResource = Object.assign({}, this.currentResource, this.currentResource.user_kyc);
        });
        this.getOTCBalance();
        this.getBalanceHistory();
      },
      getUserLimit() {
        this.$axios.get(`/users/${this.id}/limit`).then(response => {
          this.userLimit = response.data.data;
        });
      },
      getUserOperations() {
        this.$axios.get(`/users/${this.id}/operations?page=${this.operationsPage}`).then(response => {
          this.userOperations = response.data.data.data;
          this.operationsPage = response.data.data.curr_page;
          this.operationsTotal = response.data.data.total;
        });
      },
      changeOperationPage() {
        this.$nextTick(this.getUserOperations);
      },
      cancelUserLimit(limit) {
        this.constraintDialogProps = {
          title: `取消用户${limit === 'day_limit' ? '当天' : '30天'}交易限制`,
          content: '确认取消限制？取消后该用户将可以进行交易',
          remark: '',
          isAllow: false,
          dialogVisible: true,
          constraint: limit,
        };
      },
      confirmCancelUserLimit(isAllow, remark, limit) {
        this.$axios.post(`/users/${this.id}/limit`, {[limit]: false, remark}).then(this.getUserLimit());
      },
      getMerchantInfo() {
        this.$axios.get(`/users/merchant/${this.id}`).then(response => {
          this.merchant = response.data.data;
        }).catch(err => {
          if (err.code === 605) {
            this.merchant = null;
          }
        });
        this.getMerchantSetting();
      },
      getMerchantSetting() {
        this.$axios.get(`/users/${this.id}/settings`).then(response => {
          this.setting = response.data.data;
        });
      },
      getOTCBalance() {
        this.$axios.get(`/users/${this.id}/balance/otc`).then(response => {
          this.balance = response.data.data;
        });
      },
      getBalanceHistory() {
        // TODO 翻页
        this.$axios.get(`/users/${this.id}/balance/history?page=${this.historyPageNum}&limit=10`).then(response => {
          this.historyTotalNum = parseInt(response.data.data.total || response.data.total);
          this.balanceHistory = response.data.data.data;
        });
      },
      getPaymentMethods() {
        this.$axios.get(`/users/${this.id}/payment/method`).then(response => {
          this.paymentMethods = response.data.data;
        });
      },
      getUserExtra() {
        this.$axios.get(`/users/${this.id}/extra`).then(response => {
          this.userExtra = [response.data.data];
        });
      },
      allowUser() {
        this.constraintDialogProps = {
          title: '取消用户交易限制',
          content: '确认取消限制？取消后该用户将可以进行交易',
          remark: '',
          isAllow: true,
          dialogVisible: true,
          constraint: 'user',
        };
      },
      forbidUser() {
        this.constraintDialogProps = {
          title: '限制用户交易',
          content: '确认限制用户交易？',
          remark: '',
          isAllow: false,
          dialogVisible: true,
          constraint: 'user',
        };
      },
      toggleUserStatus(isAllow, remark) {
        this.$axios.patch('/users/' + this.currentResource.id, {
          status: isAllow ? 'normal' : 'forbidden',
          remark
        }).then(response => {
          this.forbidUserDialogVisible = false;
          this.$message({message: '用户交易权限已修改', type: 'success'});
          this.initSingleResource('users', this.id);
        });
      },
      allowMerchant() {
        this.constraintDialogProps = {
          title: '取消商家广告限制',
          content: '确认取消限制？取消后该商家将可以发布广告',
          remark: '',
          isAllow: true,
          dialogVisible: true,
          constraint: 'merchant',
        };
      },
      forbidMerchant() {
        this.constraintDialogProps = {
          title: '限制商家发布广告',
          content: '确认限制该商家发布广告？',
          remark: '',
          isAllow: false,
          dialogVisible: true,
          constraint: 'merchant',
        };
      },
      confirmToggleConstraint() {
        this.constraintDialogProps.dialogVisible = false;
        let toggleFunction;
        switch (this.constraintDialogProps.constraint) {
          case 'merchant':
            toggleFunction = this.toggleMerchantStatus;
            break;
          case 'user':
            toggleFunction = this.toggleUserStatus;
            break;
          case 'day_limit':
          case 'month_limit':
            toggleFunction = this.confirmCancelUserLimit;
            break;
        }
        if (toggleFunction) {
          toggleFunction(this.constraintDialogProps.isAllow, this.constraintDialogProps.remark, this.constraintDialogProps.constraint);
        }
      },
      toggleMerchantStatus(isAllow, remark) {
        this.$axios.patch('/users/merchant/' + this.currentResource.id, {
          status: isAllow ? 'normal' : 'forbidden',
          remark
        }).then(response => {
          this.forbidMerchantDialogVisible = false;
          this.$message({message: '商家发布广告权限已修改', type: 'success'});
          this.getMerchantInfo();
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
      },
      changeName() {
        this.newName = this.currentResource.name;
        this.changeNameDialogVisible = true;
      },
      confirmChangeName() {
        this.$axios.put('/users/' + this.currentResource.id, {
          name: this.newName
        }).then(response => {
          this.currentResource.name = this.newName;
          this.changeNameDialogVisible = false;
        }).catch(err => {
          this.$message(`修改失败，请联系开发人员，error=${err}`, 'error');
          this.changeNameDialogVisible = false;
        });
      },
      tabClick(tab) {
        if (tab.name === 'basic') {
          this.getUserInfo();
        }
        if (tab.name === 'merchant') {
          this.getMerchantInfo();
        }
        if (tab.name === 'transaction') {
          this.getPaymentMethods();
          this.getUserExtra();
        }
        if (tab.name === 'operation') {
          this.getUserOperations();
        }
      },
      allowPublishItem() {
        this.$axios.post(`/users/${this.id}/today/limit`, {
          ...this.userLimit,
          can_publish_item: true,
        }).then(response => {
          this.getUserLimit();
        });
      },
      allowPlaceOrder() {
        this.$axios.post(`/users/${this.id}/today/limit`, {
          ...this.userLimit,
          can_place_order: true,
        }).then(response => {
          this.getUserLimit();
        });
      },
    }
  };
</script>
<style lang="scss">
    @import "~assets/style/global.scss";

    .page-user-detail {
        .today-limit {
            & > span {
                margin-right: 2rem;
            }
        }
        .shortcuts {
            margin-bottom: 10px;
            .el-button {
                width: 160px;
                margin-right: 10px;
            }
        }
        .el-tabs__item {
            font-size: 20px;
            font-weight: bold;
        }
        .qrcode-image {
            max-width: 200px;
            max-height: 200px;
        }

    }
</style>