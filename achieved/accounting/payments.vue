<template>
    <div class="main-content">
        <h1>买家付款</h1>

        <el-row type="flex" justify="space-between">
            <el-col :md="4" :lg="2">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="20" :lg="14">
                <el-col :span="8">
                    <el-input placeholder="订单编号" clearable v-model="resourceFilters.business_id"
                              @clear="getFilteredResources">
                        <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-input placeholder="付款人姓名" clearable v-model="resourceFilters.pay_username"
                              @clear="getFilteredResources">
                        <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-input placeholder="付款人卡号" clearable v-model="resourceFilters.pay_bank_card_no"
                              @clear="getFilteredResources">
                        <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                    </el-input>
                </el-col>
            </el-col>
        </el-row>
        <el-table
                class="with-margin-top"
                :data="resources"
                style="width: 100%">
            <el-table-column v-for="(column, index) in propColumns"
                             :key="index"
                             :prop="column.prop"
                             :label="column.label"
                             :formatter="column.formatter"
                             :class-name="column.className"
                             :sortable="column.sortable"
                             :sort-method="column.sortMethod"
                             :min-width="column.width">
            </el-table-column>
            <el-table-column key="management"
                             label="操作"
                             class-name="management"
                             min-width="100">
                <template slot-scope="scope">
                    <el-button @click="markPaid(scope.row)" type="warning">已收到款项</el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination
                class="with-margin-top"
                background
                layout="prev, pager, next"
                @current-change="changePage"
                :current-page.sync="pageNum"
                :total="totalNum">
        </el-pagination>
        <el-dialog
                title="标记付款"
                :visible.sync="serialNumDialogVisible"
                width="30%">
            <el-input placeholder="请录入银行流水号" v-model="bank_flow_no"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="serialNumDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmPayment"
                           :disabled="!bank_flow_no||bank_flow_no.length<5">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import {timeToLocale} from "../../common/utilities";
  import {coinNames} from "../../common/constants";

  export default {
    layout: 'default',
    data() {
      return {
        propColumns: [{
          prop: 'business_id',
          label: '订单号',
          width: 50,
        }, {
          prop: 'create_time',
          label: '创建时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          }
        }, {
          prop: 'pay_username',
          label: '付款人姓名',
          width: 60,
        }, {
          prop: 'pay_bank_name',
          label: '付款银行',
          width: 80,
        }, {
          prop: 'pay_bank_card_no',
          label: '付款银行卡号',
          width: 140,
        }, {
          prop: 'coin_amount',
          label: '应付金额',
          width: 80
        }, {
          prop: 'payee_bank_card_no',
          label: '收款账号',
          width: 120,
        }],
        currentPaymentId: null,
        bank_flow_no: null,
        serialNumDialogVisible: false,
      }
    },
    mounted() {
      this.initResources('user/payment', null, {status: 0});// 只获取等待中的
    },
    methods: {
      markPaid(payment) {
        this.currentPaymentId = payment.id;
        this.bank_flow_no = null;
        this.serialNumDialogVisible = true;
      },
      confirmPayment() {
        this.serialNumDialogVisible = false;
        this.$axios.patch('/user/payment/' + this.currentPaymentId, {"bank_flow_no": this.bank_flow_no}).then(response => {
          if (response.data.code === 0) {
            this.resources = this.resources.filter(p => p.id !== this.currentPaymentId);
            this.currentPaymentId = null;
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
    .management {
    }
</style>
<style lang="scss">
    .time .cell {
        width: 96px;
    }
</style>