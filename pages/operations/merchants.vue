<template>
    <div class="main-content page-merchants">
        <h1>商家认证审核(仅显示提交认证的商家）
            <router-link to="/users" class="fz-14">查看所有用户</router-link>
        </h1>
        <el-row class="with-margin-top">
            <el-col :md="4" :lg="2">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="20" :lg="10">
                <el-input placeholder="输入 用户名/用户ID/手机号 查询" clearable v-model="resourceFilters.user_search"
                          @clear="getFilteredResources">
                    <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                </el-input>
            </el-col>
            <el-col :md="24" :lg="10">
                <el-row>
                    <el-col :md="8" class="resource-filter">
                        <el-select v-model="resourceFilters.auth_status"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="认证状态">
                            <el-option
                                    v-for="(status,index) in merchantAuthStatusTypes"
                                    :key="index"
                                    :label="status.text"
                                    :value="status.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :md="16" class="resource-filter">
                        <el-date-picker
                                v-model="resourcesDateRange"
                                type="daterange"
                                :clearable="true"
                                @change="getFilteredResources"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-table
                :data="resources"
                @sort-change="sortChange"
                style="width: 100%">
            <el-table-column
                    key="id"
                    label="ID"
                    min-width="60"
            >
                <template slot-scope="scope">
                    <router-link :to="'/users/'+scope.row.user_id">
                        {{scope.row.user_id}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column :key="index"
                             v-for="(column, index) in itemColumns"
                             :prop="column.prop"
                             :label="column.label"
                             :formatter="column.formatter"
                             :sortable="column.sortable"
                             :class-name="column.className"
                             :sort-method="column.sortMethod"
                             :min-width="column.width">
            </el-table-column>
            <el-table-column
                    key="action"
                    label="操作"
                    min-width="200"
            >
                <template slot-scope="scope">
                    <template v-if="scope.row.auth_status === 'created'">
                        <el-button type="success" @click="passAuth(scope.row)">通过</el-button>
                        <el-button type="danger" @click="failAuth(scope.row)">不通过</el-button>
                    </template>
                    <template v-if="scope.row.auth_status === 'pass'">
                        <!--<el-button type="danger" @click="passAuth(scope.row)">取消认证</el-button>-->
                        <router-link :to="'/users/'+scope.row.user_id">
                            <el-button>详情</el-button>
                        </router-link>
                    </template>
                    <template v-if="scope.row.auth_status === 'no'">
                        <!--<el-button type="success" @click="passAuth(scope.row)">通过</el-button>-->
                        <router-link :to="'/users/'+scope.row.user_id">
                            <el-button>详情</el-button>
                        </router-link>
                    </template>

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
                v-if="currentMerchant"
                title="认证不通过"
                :visible.sync="authDialogVisible"
                width="30%">
            <p>拒绝用户 {{currentMerchant.name}} 的商家认证申请：</p>
            <el-input :rows="4" type="textarea" placeholder="请填写认证不通过的原因(五个字符以上)" v-model="authComment"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="authDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmFailAuth"
                           :disabled="!authComment||authComment.length<5">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import {licenseTypes, merchantAuthStatusTypes} from '~/common/constants';
  import {timeToLocale} from '~/common/utilities';

  export default {
    layout: 'default',
    data() {
      return {
        currentMerchant: null,
        authComment: null,
        authDialogVisible: false,
        merchantAuthStatusTypes,
        licenseTypes,
        itemColumns: [{
          prop: 'create_time',
          label: '申请时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue);
          },
          className: 'time',
        }, {
          prop: 'user',
          label: '用户名',
          width: 80,
          formatter: (row, column, cellValue) => {
            return row.user.name;
          },
        }, {
          prop: 'first_name',
          label: '实名',
          width: 80,
          formatter: (row, column, cellValue) => {
            return row.last_name + ' ' + row.first_name;
          },
        }, {
          prop: 'id_type',
          label: '证件',
          width: 120,
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, licenseTypes) + ': ' + row.id_number;
          },
        }, {
          prop: 'guaranty_amount',
          label: 'CET保证金',
          width: 80,
          formatter: (row, column, cellValue) => {
            return parseInt(cellValue);
          },
        }, {
          prop: 'mobile',
          label: '手机',
          width: 120,
        }, {
          prop: 'email',
          label: '邮箱',
          width: 120,
        }, {
          prop: 'wechat',
          label: '微信号',
          width: 120,
        }, {
          prop: 'auth_status',
          label: '认证状态',
          width: 96,
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, merchantAuthStatusTypes);
          },
        }],
      };
    },
    mounted() {
      this.getMerchants();
    },
    methods: {
      getMerchants() {
        this.initResources('users/merchant', () => {
          // 扁平化方便表格展示
          this.resources = this.resources.map(r => Object.assign({}, r, r.user, r.user_kyc));
        }, {
          user_search: this.$route.query.user_search
        });
      },
      passAuth(merchant) {
        this.currentMerchant = merchant;
        this.changeAuth(true, '');
      },
      failAuth(merchant) {
        this.currentMerchant = merchant;
        this.authComment = null;
        this.authDialogVisible = true;
      },
      confirmFailAuth() {
        this.changeAuth(false, this.authComment);
      },
      changeAuth(isSuccess, comment) {
        this.$axios.post(`/users/merchant/${this.currentMerchant.id}`, {
          auth_status: isSuccess ? 'pass' : 'no',
          remark: comment
        }).then(response => {
          this.authDialogVisible = false;
          this.$message({message: '商家认证结果已提交', type: 'success'});
          this.getMerchants();
        });
      }
    }
  };
</script>