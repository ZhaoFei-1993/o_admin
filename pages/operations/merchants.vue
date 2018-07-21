<template>
    <div class="main-content page-merchants">
        <h1>商家认证审核(仅显示认证中的商家）
            <router-link to="/users" class="fz-14">查看所有商家</router-link>
        </h1>
        <el-row>
            <el-col :md="4" :lg="2">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="20" :lg="10">
                <el-input placeholder="输入 用户名/用户ID/手机号/邮箱 查询" clearable v-model="resourceFilters.search"
                          @clear="getFilteredResources">
                    <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table
                class="with-margin-top"
                :data="resources"
                @sort-change="sortChange"
                style="width: 100%">
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
                    min-width="180"
            >
                <template slot-scope="scope">
                    <el-button type="success" @click="passAuth(scope.row)">通过</el-button>
                    <el-button type="danger" @click="failAuth(scope.row)">不通过</el-button>
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
            <p>拒绝用户 {{currentMerchant.name}} 的认证申请：</p>
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
  import {roles, kycStatusTypes, userStatusTypes, merchantAuthStatusTypes} from "~/common/constants";
  import {itemText, timeToLocale} from "~/common/utilities";

  export default {
    layout: 'default',
    data() {
      return {
        currentMerchant: null,
        authComment: null,
        authDialogVisible: false,
        merchantAuthStatusTypes,
        itemColumns: [{
          prop: 'id',
          label: 'ID',
          width: 36,
          link: '/users'
        }, {
          prop: 'create_time',
          label: '注册时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
          className: 'time',
        }, {
          prop: 'kyc_name',
          label: '姓名',
          width: 80,
          formatter: (row, column, cellValue) => {
            return cellValue || '未实名'
          },
        }, {
          prop: 'idcard_no',
          label: '证件号',
          width: 120,
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
        },],
      }
    },
    mounted() {
      this.getMerchants();
    },
    methods: {
      getMerchants() {
        this.initResources('users');
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
        this.$axios.patch(`/merchant/${this.currentMerchant.id}/auth/`, {
          auth_status: isSuccess ? 2 : 3,
          reason: comment
        }).then(response => {
          this.$message({message: '商家认证结果已提交', type: 'success'})
          this.getMerchants();
        })
      }
    }
  }
</script>