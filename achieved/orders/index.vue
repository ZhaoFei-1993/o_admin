<template>
    <div class="main-content">
        <h1>订单管理</h1>
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
                <el-col :span="8">
                    <el-input placeholder="请输入广告标题" clearable v-model="resourceFilters.title"
                              @clear="getFilteredResources">
                        <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-input placeholder="请输入订单编号" clearable v-model="resourceFilters.order_no"
                              @clear="getFilteredResources">
                        <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                    </el-input>
                </el-col>
            </el-col>
            <el-col :md="24" :lg="8">
                <el-row type="flex" justify="end">
                    <el-col :lg="8" class="resource-filter">
                        <el-select v-model="resourceFilters.kind_category_id"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="类型">
                            <el-option
                                    v-for="(product,index) in productTypes"
                                    :key="index+1"
                                    :label="product"
                                    :value="index+1">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :lg="8" class="resource-filter">
                        <el-select v-model="resourceFilters.order_status"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="状态">
                            <el-option
                                    v-for="(status,index) in statusTypes"
                                    :key="index"
                                    :label="status"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :lg="8" class="resource-filter">
                        <el-select v-model="resourceFilters.is_freeze"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="申诉情况">
                            <el-option
                                    v-for="status in freezeTypes"
                                    :key="status.label"
                                    :label="status.label"
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
                @sort-change="sortChange"
                style="width: 100%">
            <el-table-column v-for="(column, index) in orderColumns"
                             v-if="column.link"
                             :key="index"
                             :prop="column.prop"
                             :label="column.label"
                             :formatter="column.formatter"
                             :class-name="column.className"
                             :sortable="column.sortable"
                             :sort-method="column.sortMethod"
                             :min-width="column.width">
                <template slot-scope="scope">
                    <router-link :to="column.link+'/'+(column.text?scope.row[column.prop]['id']:scope.row['id'])"
                                 append>
                        {{column.text?scope.row[column.prop][column.text]:scope.row[column.prop]}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column v-else
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
                    key="snapshot"
                    label="快照"
                    min-width="80"
            >
                <template slot-scope="scope">
                    <router-link :to="scope.row['id'] +'/snapshot'"
                                 append>
                        <el-button type="primary" class="view-snapshot">查看快照</el-button>
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
  import {getItemStatusOfIndex, timeToLocale} from "../../common/utilities";
  import {orderStatus, productTypes, adminUsers, priceNames, freezeStatus} from "../../common/constants";

  export default {
    layout: 'default',
    data() {
      return {
        orderColumns: [{
          prop: 'create_time',
          label: '下单时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
          sortable: true,
          className: 'time',
        }, {
          prop: 'order_no',
          label: '订单编号',
          width: 140,
          link: '/orders'
        }, {
          prop: 'buy_user',
          label: '买方',
          width: 80,
          link: adminUsers,
          text: 'username',
        }, {
          prop: 'sell_user',
          label: '卖方',
          width: 80,
          link: adminUsers,
          text: 'username',
        }, {
          prop: 'total_price',
          label: '总价',
          width: 120,
          formatter: (row, column, cellValue) => {
            return cellValue + priceNames[row.price_type];
          },
        }, {
          prop: 'item',
          label: '广告标题',
          width: 220,
          link: '/items',
          text: 'title',
        }, {
          prop: 'status',
          label: '状态',
          width: 96,
          formatter: (row, column, cellValue) => {
            return orderStatus[cellValue];
          },
        }],
        statusTypes: orderStatus,
        freezeTypes: freezeStatus,
        productTypes: productTypes,
      }
    },
    mounted() {
      this.initResources('orders', () => {
        if (this.resources && this.resources.length > 0) {
          this.resources.forEach(order => {
            order.id = order.order_no;
            order.item = {
              title: order.title,
              id: order.item_id,
            };
          });
        }
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
<style lang="scss">

</style>