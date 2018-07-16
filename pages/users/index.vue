<template>
    <div class="main-content">
        <h1>用户管理</h1>
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
            <el-col :md="24" :lg="12">
                <el-row type="flex" justify="end">
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-select v-model="resourceFilters.role"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="用户身份">
                            <el-option
                                    v-for="(role,index) in roles"
                                    :key="index"
                                    :label="role.text"
                                    :value="role.name">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-select v-model="resourceFilters.status"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="用户状态">
                            <el-option
                                    v-for="(status,index) in userStatusTypes"
                                    :key="index"
                                    :label="status.text"
                                    :value="status.name">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-select v-model="resourceFilters.kyc_status"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="是否实名">
                            <el-option
                                    v-for="(status,index) in kycStatusTypes"
                                    :key="index"
                                    :label="status.text"
                                    :value="status.name">
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
                @sort-change="sortChange"
                :row-class-name="itemRowClassName">
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
                    min-width="80"
            >
                <template slot-scope="scope">
                    <router-link :to="'/users/'+scope.row['id']"
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
  import {roles, kycStatusTypes, userStatusTypes} from "../../common/constants";
  import {timeToLocale} from "../../common/utilities";

  export default {
    layout: 'default',
    data() {
      return {
        roles,
        userStatusTypes,
        kycStatusTypes,
        itemColumns: [{
          prop: 'id',
          label: 'ID',
          width: 36,
          link: '/users'
        }, {
          prop: 'create_time',
          label: 'OTC注册时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
          sortable: true,
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
            return cellValue || '未实名'
          },
        }, {
          prop: 'role',
          label: '身份',
          width: 72,
          formatter: (row, column, cellValue) => {
            const role = this.roles.find(r => r.name === cellValue)
            return role ? role.text : '--'
          },
        }, {
          prop: 'mobile',
          label: '手机',
          width: 120,
        }, {
          prop: 'email',
          label: '邮箱',
          width: 240,
        }, {
          prop: 'status',
          label: '状态',
          formatter: (row, column, cellValue) => {
            const status = this.userStatusTypes.find(r => r.name === cellValue)
            return status ? status.text : '--'
          },
        },],
      }
    },
    mounted() {
      this.initResources('users');
    },
    methods: {
      itemRowClassName({row, rowIndex}) {
        return ''
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
    td.time .cell {
        word-break: normal;
    }

    tr.ready {
        background-color: #D5FFF3;
    }
</style>