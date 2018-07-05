<template>
    <div class="main-content">
        <h1>收入详情</h1>
        <el-row>
            <el-col :md="4" :lg="2">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="10" :lg="9" class="horizon-padding">
                <el-input placeholder="查找广告编号" clearable v-model="resourceFilters.item_id"
                          @clear="getFilteredResources">
                    <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                </el-input>
            </el-col>
            <el-col :md="10" :lg="9" class="horizon-padding">
                <el-input placeholder="查找账户名" clearable v-model="resourceFilters.username"
                          @clear="getFilteredResources">
                    <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                </el-input>
            </el-col>
            <el-col :md="24" :lg="4">
                <el-select v-model="resourceFilters.coin_type"
                           @change="getFilteredResources"
                           clearable
                           placeholder="币种">
                    <el-option
                            v-for="(coin,index) in coinNames"
                            :key="index"
                            :label="coin"
                            :value="index">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-table
                class="with-margin-top"
                :data="resources"
                @sort-change="sortChange"
                style="width: 100%">
            <el-table-column v-for="(column, index) in incomeColumns"
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
                    <router-link :to="column.link+(column.text?scope.row[column.prop]['id']:scope.row['id'])+'/'">
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
  import {coinNames, orderStatus, productTypes, adminUsers} from "../../common/constants";

  export default {
    layout: 'default',
    data() {
      return {
        incomeColumns: [{
          prop: 'create_time',
          label: '时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
          sortable: true,
          className: 'time',
        }, {
          prop: 'item',
          label: '广告',
          width: 120,
          link: '/items/',
          text: 'title',
        }, {
          prop: 'user',
          label: '账户',
          width: 80,
          link: adminUsers,
          text: 'name',
        }, {
          prop: 'coin_type',
          label: '币种',
          width: 72,
          formatter: (row, column, cellValue) => {
            return coinNames[cellValue];
          },
        }, {
          prop: 'coin_price',
          label: '金额',
          width: 72,
        }],
        statusTypes: orderStatus,
        productTypes: productTypes,
        coinNames: coinNames,
      }
    },
    mounted() {
      this.initResources('incomes/item', () => {
        if (this.resources && this.resources.length > 0) {
          this.resources.forEach(income => {
            income.item = {
              title: income.item_title,
              id: income.item_id,
            };
            income.user = {
              name: income.username,
              id: income.user_id,
            };
          });
        }
      });
    },
    methods: {}
  }
</script>
<style lang="scss" scoped>
    .horizon-padding {
        padding: 0 10px;
    }
</style>
<style lang="scss">

</style>