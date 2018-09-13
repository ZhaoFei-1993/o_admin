<template>
    <div class="main-content">
        <h1>广告管理</h1>
        <el-row>
            <el-col :md="4" :lg="2">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="20" :lg="10">
                <el-input placeholder="请输入 用户名/用户ID/手机号" clearable v-model="resourceFilters.user_search"
                          @clear="getFilteredResources">
                    <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                </el-input>
            </el-col>
            <el-col :md="24" :lg="12">
                <el-row type="flex" justify="end">
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-select v-model="resourceFilters.coin_type"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="币种">
                            <el-option
                                    v-for="(coin,index) in coinTypes"
                                    :key="index"
                                    :label="coin"
                                    :value="coin">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-select v-model="resourceFilters.status"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="状态">
                            <el-option
                                    v-for="(status,index) in itemStatusTypes"
                                    :key="index"
                                    :label="status.text"
                                    :value="status.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-select v-model="resourceFilters.side"
                                   @change="getFilteredResources"
                                   clearable
                                   placeholder="类型">
                            <el-option
                                    v-for="(side,index) in sides"
                                    :key="index"
                                    :label="side.text"
                                    :value="side.value">
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
                    min-width="80"
            >
                <template slot-scope="scope">
                    <router-link :to="'/items/'+scope.row['id']">
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
  import {sides, coinTypes, paymentTypes, itemStatusTypes} from '~/common/constants';
  import {timeToLocale} from '~/common/utilities';

  export default {
    layout: 'default',
    data() {
      return {
        sides,
        coinTypes,
        paymentTypes,
        itemStatusTypes,
        itemColumns: [{
          prop: 'id',
          label: 'ID',
          width: 60,
        }, {
          prop: 'user',
          label: '商家',
          width: 140,
          text: 'name',
          link: '/users',
        }, {
          prop: 'side',
          label: '方向',
          width: 72,
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, sides);
          },
        }, {
          prop: 'price',
          label: '单价',
          width: 90,
        }, {
          prop: 'coin_type',
          label: '币种',
          width: 90,
        }, {
          prop: 'remain_coin_amount',
          label: '库存',
          width: 90,
        }, {
          prop: 'status',
          label: '状态',
          width: 80,
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, itemStatusTypes);
          },
        }, {
          prop: 'on_time',
          label: '上架时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue);
          },
        }],
      };
    },
    mounted() {
      this.initResources('items', () => {
        if (this.resources && this.resources.length === 1) {
          this.$router.push(`/items/${this.resources[0].id}`);
        }
      }, {
        user_search: this.$route.query.user_search
      });
    },
    methods: {}
  };
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