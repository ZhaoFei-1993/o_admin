<template>
    <div class="main-content">
        <h1>广告管理</h1>
        <el-row>
            <el-col :md="4" :lg="2">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="20" :lg="10">
                <el-row>
                    <el-col :span="12">
                        <el-input placeholder="请输入用户名" clearable v-model="resourceFilters.username"
                                  @clear="getFilteredResources">
                            <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="12">
                        <el-input placeholder="请输入广告标题" clearable v-model="resourceFilters.title"
                                  @clear="getFilteredResources">
                            <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                        </el-input>
                    </el-col>
                </el-row>

            </el-col>
            <el-col :md="24" :lg="12">
                <el-row type="flex" justify="end">
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-select v-model="resourceFilters.coin_type"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="支付方式">
                            <el-option
                                    v-for="(coin,index) in receiveCoinTypes"
                                    :key="index"
                                    :label="coin"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :md="8" :lg="6" class="resource-filter">
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
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-select v-model="resourceFilters.status"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="状态">
                            <el-option
                                    v-for="(status,index) in statusTypes"
                                    :key="index"
                                    :label="status"
                                    :value="index-1">
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
  import {coinNames, itemStatus, priceNames, adminUsers, productTypes} from "../../common/constants";
  import {getItemStatusOfIndex, mapCoinType, timeToLocale} from "../../common/utilities";

  export default {
    layout: 'default',
    data() {
      return {
        receiveCoinTypes: coinNames,
        statusTypes: itemStatus,
        productTypes: productTypes,
        itemColumns: [{
          prop: 'create_time',
          label: '创建时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
          sortable: true,
          className: 'time',
        }, {
          prop: 'issue_time',
          label: '发布时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
          sortable: true,
          className: 'time',
        }, {
          prop: 'user',
          label: '用户',
          width: 80,
          link: adminUsers,
          text: 'username',
        }, {
          prop: 'kind_category_id',
          label: '类型',
          width: 72,
          formatter: (row, column, cellValue) => {
            return getItemStatusOfIndex(cellValue - 1, productTypes);// this id starts with 1!!!
          },
        }, {
          prop: 'title',
          label: '标题',
          width: 360,
          link: '/items',
        }, {
          prop: 'price',
          label: '单价',
          width: 130,
          // sortMethod: (a, b) => {
          //   return getApproxCny(a.price, a.price_type) - getApproxCny(b.price, b.price_type);
          // },
          formatter: (row, column, cellValue) => {
            return cellValue + priceNames[row.price_type];
          },
          className: 'price',
        }, {
          prop: 'inventory',
          label: '库存',
          width: 80,
        }, {
          prop: 'pay_methods',
          label: '支付方式',
          width: 150,
          formatter: (row, column, cellValue) => {
            return mapCoinType(cellValue)
          },
        }, {
          prop: 'status',
          label: '状态',
          width: 80,
          formatter: (row, column, cellValue) => {
            return getItemStatusOfIndex(cellValue, itemStatus);
          },
        }],
      }
    },
    mounted() {
      this.initResources('items');
    },
    methods: {
      itemRowClassName({row, rowIndex}) {
        switch (row.status) {
          case 0:
            return 'waiting';
          case 1:
            return 'ready';
          case 2:
            return 'done';
          case 3:
            return 'expired';
          default:
            return '';
        }
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