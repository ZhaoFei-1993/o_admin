<template>
    <div class="main-content seller-info">
        <h1>卖家详细信息</h1>
        <el-tabs class="with-margin-top" type="border-card">
            <el-tab-pane label="认证信息">
                <AuthInfo v-if="authRecord" :record="authRecord" :show="'only-auth'"/>
            </el-tab-pane>
            <el-tab-pane label="结算信息">
                <AuthInfo v-if="authRecord" :record="authRecord" :show="'only-bank'"/>
                <el-table
                        class="with-margin-top accounting-table"
                        :data="resources"
                        style="width: 100%">
                    <el-table-column v-for="(column, index) in itemColumns"
                                     v-if="column.link && !column.hidden"
                                     :key="index"
                                     :prop="column.prop"
                                     :label="column.label"
                                     :formatter="column.formatter"
                                     :class-name="column.className"
                                     :sortable="column.sortable"
                                     :sort-method="column.sortMethod"
                                     :min-width="column.width">
                        <template slot-scope="scope">
                            <router-link
                                    :to="column.link+'/'+(column.text?scope.row[column.prop]['id']:scope.row['id'])">
                                {{column.text?scope.row[column.prop][column.text]:scope.row[column.prop]}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="!column.hidden"
                                     :key="index"
                                     :prop="column.prop"
                                     :label="column.label"
                                     :formatter="column.formatter"
                                     :sortable="column.sortable"
                                     :class-name="column.className"
                                     :sort-method="column.sortMethod"
                                     :min-width="column.width">
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
  import AuthInfo from '~/components/AuthInfo'
  import {businessType, payFlowStatus} from "../../../common/constants";
  import {timeToLocale} from "../../../common/utilities";

  export default {
    data() {
      return {
        authRecord: null,
        itemColumns: [{
          prop: 'create_time',
          label: '创建时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
        }, {
          prop: 'user_id',
          label: '用户ID',
          width: 50,
        }, {
          prop: 'business_id',
          label: '业务ID',
          width: 50,
        }, {
          prop: 'business_type',
          label: '业务类型',
          width: 50,
          formatter: (row, col, v) => {
            return businessType[v] ? businessType[v].cn : ''
          }
        }, {
          prop: 'status',
          label: '状态',
          width: 80,
          formatter: (row, col, v) => {
            return payFlowStatus[v]
          }
        }, {
          prop: 'bank_flow_no',
          label: '银行流水号',
          width: 80,
        }, {
          prop: 'pay_bank_card_no',
          label: '付款银行卡号',
          width: 80,
        }, {
          prop: 'operator_id',
          label: '操作人id',
          width: 80,
        }, {
          prop: 'operator_name',
          label: '操作人姓名',
          width: 80,
        }],
      }
    },
    components: {
      AuthInfo
    },
    mounted() {
      this.getRecord();
      this.getBalance();
    },
    methods: {
      getRecord() {
        this.$axios.get('user/auth/' + this.$route.params.id).then(response => {
          console.log(response.data.data)
          this.authRecord = response.data.data;
        });
      },
      getBalance() {
        this.initResources(`user/${this.$route.params.id}/balance/detail`);
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>