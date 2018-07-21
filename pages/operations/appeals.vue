<template>
    <div class="main-content page-appeals">
        <h1>申诉管理中心
            <router-link to="/orders" class="fz-14">查看所有订单</router-link>
        </h1>
        <el-row>
            <el-col :md="4" :lg="2">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="20" :lg="10">
                <el-input placeholder="输入 订单号/用户名 查询" clearable v-model="resourceFilters.search"
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
                    min-width="90"
            >
                <template slot-scope="scope">
                    <router-link :to="`/orders/${scope.row.id}`">
                        <el-button type="success">查看详情</el-button>
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
  import {appealStatusTypes, orderStatusTypes} from "~/common/constants";
  import {itemText, timeToLocale} from "~/common/utilities";

  export default {
    layout: 'default',
    data() {
      return {
        appealStatusTypes,
        orderStatusTypes,
        itemColumns: [{
          prop: 'id',
          label: '订单ID',
          width: 36,
        }, {
          prop: 'status',
          label: '订单状态',
          formatter: (row, column, cellValue) => {
            return itemText(cellValue, orderStatusTypes)
          },
        }, {
          prop: 'appeal_time',
          label: '申诉时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
          className: 'time',
        }, {
          prop: 'appeal_status',
          label: '申诉状态',
          width: 80,
          formatter: (row, column, cellValue) => {
            return itemText(cellValue, appealStatusTypes)
          },
        }, {
          prop: 'idcard_no',
          label: '申诉发起方',
          width: 120,
        }, {
          prop: 'result',
          label: '申诉结果',
          formatter: (row, column, cellValue) => {
            return itemText(cellValue, appealResultTypes)
          },
        }, {
          prop: 'wechat',
          label: '微信号',
          width: 120,
        },],
      }
    },
    mounted() {
      this.getAppeals();
    },
    methods: {
      getAppeals() {
        this.initResources('orders');
      },
    }
  }
</script>