<template>
    <div class="main-content page-appeals">
        <h1>申诉管理中心
            <router-link to="/orders" class="fz-14">查看所有订单</router-link>
        </h1>
        <el-row>
            <el-col :md="3">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="7">
                <el-input placeholder="输入 订单ID 查询" clearable v-model="resourceFilters.order_id"
                          @clear="getFilteredResources" @keyup.enter.native="getFilteredResources">
                    <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                </el-input>
            </el-col>
            <el-col :md="7">
                <el-input placeholder="输入 用户ID/手机号 查询" clearable v-model="resourceFilters.user_search"
                          @clear="getFilteredResources" @keyup.enter.native="getFilteredResources">
                    <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                </el-input>
            </el-col>
            <el-col :md="7" class="resource-filter">
                <el-select v-model="resourceFilters.appeal_status"
                           @change="getFilteredResources"
                           clearable
                           placeholder="申诉状态">
                    <el-option
                            v-for="(status,index) in appealStatusTypes"
                            :key="index"
                            :label="status.text"
                            :value="status.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-table
                class="with-margin-top"
                :data="resources"
                @sort-change="sortChange"
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
                    <router-link :to="column.link+'/'+(column.text?scope.row[column.prop]['id']:scope.row['id'])">
                        {{column.text?scope.row[column.prop][column.text]:scope.row[column.prop]}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column :key="index"
                             v-else
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
                    <router-link :to="`/orders/${scope.row.order.id}`">
                        <el-button type="success">查看详情</el-button>
                    </router-link>
                </template>
            </el-table-column>
        </el-table>
        <no-ssr>
        <el-pagination
                class="with-margin-top"
                background
                layout="prev, pager, next"
                @current-change="changePage"
                :current-page.sync="pageNum"
                :total="totalNum">
        </el-pagination>
        </no-ssr>
    </div>
</template>
<script>
  import {appealStatusTypes, appealResultTypes, orderStatusTypes} from '~/common/constants';
  import {timeToLocale} from '~/common/utilities';

  export default {
    layout: 'default',
    data() {
      return {
        appealStatusTypes,
        appealResultTypes,
        orderStatusTypes,
        itemColumns: [{
          prop: 'order',
          label: '订单ID',
          link: '/orders',
          text: 'id',
        }, {
          prop: 'order',
          label: '订单状态',
          formatter: (row, column, value) => {
            return this.itemText(value.status, orderStatusTypes);
          },
        }, {
          prop: 'create_time',
          label: '申诉时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue);
          },
          className: 'time',
        }, {
          prop: 'status',
          label: '申诉状态',
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, appealStatusTypes);
          },
        }, {
          prop: 'user',
          label: '申诉发起方',
          text: 'name',
          link: '/users'
        }, {
          prop: 'title',
          label: '申诉原因',
          width: 120,
        }, {
          prop: 'detail',
          label: '申诉详情',
          width: 120,
          formatter: (row, column, cellValue) => {
            return cellValue && cellValue.length > 50 ? `${cellValue.slice(0, 50)}...` : cellValue;
          },
        }, {
          prop: 'result',
          label: '申诉结果',
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, appealResultTypes);
          },
        }],
      };
    },
    mounted() {
      // TODO 清空search的时候去掉query
      this.initResources('orders/appeal', null, {
        user_search: this.$route.query.user_search
      });
    },
    methods: {
    }
  };
</script>
