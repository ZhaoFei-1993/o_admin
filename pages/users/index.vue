<template>
    <div class="main-content page-users">
        <h1>用户管理</h1>
        <el-row>
            <el-col :md="4" :lg="2">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="20" :lg="10">
                <el-input placeholder="输入 用户名/用户ID/手机号 查询" clearable v-model="resourceFilters.user_search"
                          @clear="getFilteredResources">
                    <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                </el-input>
            </el-col>
            <el-col :md="24" :lg="12">
                <el-row type="flex" justify="end">
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-select v-model="resourceFilters.is_merchant"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="用户角色">
                            <el-option
                                    v-for="(status,index) in userRoles"
                                    :key="index"
                                    :label="status.text"
                                    :value="status.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-select v-model="resourceFilters.status"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="交易状态">
                            <el-option
                                    v-for="(status,index) in userStatusTypes"
                                    :key="index"
                                    :label="status.text"
                                    :value="status.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-table
                class="with-margin-top"
                :data="resources"
                style="width: 100%"
                @sort-change="sortChange">
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
                    <router-link :to="column.link+'/'+(column.text?scope.row[column.prop]['id']:scope.row['id'])">
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
            <el-table-column
                    key="action"
                    label="操作"
                    min-width="90"
            >
                <template slot-scope="scope">
                    <router-link :to="'/users/'+scope.row.id"
                                 append>
                        <el-button type="primary" class="view-detail">查看详情</el-button>
                    </router-link>
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
    </div>
</template>
<script>
  import {userRoles, kycStatusTypes, userStatusTypes, merchantAuthStatusTypes} from '~/common/constants';
  import {timeToLocale} from '~/common/utilities';

  export default {
    layout: 'default',
    data() {
      return {
        userRoles,
        userStatusTypes,
        kycStatusTypes,
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
            return timeToLocale(cellValue);
          },
          className: 'time',
        }, {
          prop: 'name',
          label: '昵称',
          width: 80,
        }, {
          prop: 'kyc_name',
          label: '姓名',
          width: 80,
          formatter: (row, column, cellValue) => {
            return cellValue || '未实名';
          },
        }, {
          prop: 'is_merchant',
          label: '角色',
          width: 72,
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, userRoles);
          },
        }, {
          prop: 'mobile',
          label: '手机',
          width: 120,
          formatter: (row, column, cellValue) => {
            return cellValue || '--';
          },
        }, {
          prop: 'email',
          label: '邮箱',
          width: 200,
        }, {
          prop: 'status',
          label: '用户状态',
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, userStatusTypes);
          },
        }],
      };
    },
    mounted() {
      this.initResources('users', () => {
        if (this.resources && this.resources.length === 1) {
          this.$router.push(`/users/${this.resources[0].id}`);
        }
      }, {
        user_search: this.$route.query.user_search
      });
    },
    methods: {}
  };
</script>

<style lang="scss">
    .page-users {
        .view-detail {
            width: 80px;
            padding: 12px;
        }
    }
</style>