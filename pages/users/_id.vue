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
            <div class="with-margin-top today-limit" v-if="todayLimit">
                <span>当日取消订单次数过多限制：</span>
                <span v-if="!todayLimit.can_place_order">
                    限制下单
                    <el-button type="danger" @click="allowPlaceOrder">
                        恢复交易权限
                    </el-button>
                </span>
                <span v-if="!todayLimit.can_publish_item">
                    限制发布广告
                    <el-button type="danger" @click="allowPublishItem">
                        恢复广告权限
                    </el-button>
                </span>
                <span v-if="todayLimit.can_place_order&&todayLimit.can_publish_item">未限制</span>
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
                                           @click="toggleUserStatus(false)"
                                >
                                    限制交易
                                </el-button>
                                <el-button v-else type="danger" @click="toggleUserStatus(true)" class="float-right">
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
                                {{currentResource.user_kyc?'已认证':'未实名'}}
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
                                           @click="toggleMerchantStatus(false)">
                                    限制发布广告
                                </el-button>
                                <el-button v-else type="danger" @click="toggleMerchantStatus(true)">
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
            </el-tabs>
            <el-dialog
                    title="限制交易"
                    :visible.sync="forbidUserDialogVisible"
                    width="30%">
                <p>确认限制用户{{currentResource.name}}交易吗？该用户将无法创建订单。</p>
                <el-input :rows="4" type="textarea" placeholder="请填写限制用户交易的原因(五个字符以上)"
                          v-model="forbidUserRemark"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="forbidUserDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmForbidUser"
                               :disabled="!forbidUserRemark||forbidUserRemark.length<5">确 定
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog
                    title="限制发布广告"
                    :visible.sync="forbidMerchantDialogVisible"
                    width="30%">
                <p>确认限制商家{{currentResource.name}}发布广告吗？该商家将无法发布广告。</p>
                <el-input :rows="4" type="textarea" placeholder="请填写限制发布广告的原因(五个字符以上)"
                          v-model="forbidMerchantRemark"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="forbidMerchantDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmForbidMerchant"
                               :disabled="!forbidMerchantRemark||forbidMerchantRemark.length<5">确 定
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
        todayLimit: {},
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
      };
    },
    mounted() {
      this.getUserInfo();
      this.getTodayLimit();
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
      getTodayLimit() {
        this.$axios.get(`/users/${this.id}/today/limit`).then(response => {
          this.todayLimit = response.data.data;
        });
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
      allowUser() {
        this.toggleUserStatus(true, '');
      },
      forbidUser() {
        this.forbidUserRemark = null;
        this.forbidUserDialogVisible = true;
      },
      confirmForbidUser() {
        this.toggleUserStatus(false, this.forbidUserRemark);
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
        this.toggleMerchantStatus(true, '');
      },
      forbidMerchant() {
        this.forbidMerchantRemark = null;
        this.forbidMerchantDialogVisible = true;
      },
      confirmForbidMerchant() {
        this.toggleMerchantStatus(false, this.forbidMerchantRemark);
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
        }
      },
      allowPublishItem() {
        this.$axios.post(`/users/${this.id}/today/limit`, {
          ...this.todayLimit,
          can_publish_item: true,
        }).then(response => {
          this.getTodayLimit();
        });
      },
      allowPlaceOrder() {
        this.$axios.post(`/users/${this.id}/today/limit`, {
          ...this.todayLimit,
          can_place_order: true,
        }).then(response => {
          this.getTodayLimit();
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