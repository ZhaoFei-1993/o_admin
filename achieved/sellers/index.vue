<template>
    <div class="main-content">
        <h1>卖家列表</h1>
        <el-row>
            <el-col :md="4" :lg="2">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="20" :lg="14">
                <el-col :span="8">
                    <el-input placeholder="请输入用户名" clearable v-model="resourceFilters.username"
                              @clear="getFilteredResources">
                        <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                    </el-input>
                </el-col>
            </el-col>
        </el-row>
        <el-table
                class="with-margin-top"
                :data="resources"
                @sort-change="sortChange"
                style="width: 100%">
            <el-table-column v-for="(column, index) in sellerColumns"
                             :key="index"
                             :prop="column.prop"
                             :label="column.label"
                             :formatter="column.formatter"
            >
            </el-table-column>
            <el-table-column
                    key="manage"
                    label="操作"
                    min-width="80"
            >
                <template slot-scope="scope">
                    <router-link :to="''+scope.row.user_id"
                                 append>
                        <el-button type="primary" class="view-seller">详细资料</el-button>
                    </router-link>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="with-margin-top"
                hidden
                background
                layout="prev, pager, next"
                @current-change="changePage"
                :current-page.sync="pageNum"
                :total="totalNum">
        </el-pagination>
    </div>
</template>
<script>
  import {timeToLocale} from "~/common/utilities";

  export default {
    layout: 'default',
    data() {
      return {
        sellerColumns: [{
          prop: 'user_id',
          label: '用户ID',
          width: 60,
        }, {
          prop: 'username',
          label: '用户名',
          width: 96,
        }, {
          prop: 'auth_time',
          label: '完成认证时间',
          width: 140,
          formatter: (row, col, v) => {
            return timeToLocale(v)
          }
        }, {
          prop: 'auth_type',
          label: '认证类型',
          width: 80,
          formatter: (row, col, v) => {
            return v === 1 ? '个人' : '企业'
          }
        }, {
          prop: 'coin_amount',
          label: '未结清余额',
          width: 80,
        }],
      }
    },
    mounted() {
      this.initResources('user/seller', () => {
        this.resources.forEach(row => {
          if (!row.coin_amount) {
            row.coin_amount = '--'
          }
        });
        this.totalNum = this.resources.length;
      });
    },
    methods: {}
  }
</script>
<style lang="scss" scoped>
    .view-snapshot {
        padding: 12px 8px;
    }
</style>