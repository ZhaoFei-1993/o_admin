<template>
    <div class="main-content">
        <h1>订单管理</h1>
        <el-row>
            <el-col :md="2">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="7">
                <el-input placeholder="输入 用户id 查询" clearable v-model="resourceFilters.user_id"
                          @clear="getFilteredResources" @keyup.enter.native="getFilteredResources">
                    <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                </el-input>
            </el-col>
            <el-col :md="7">
                <el-input placeholder="输入 订单id 查询" clearable v-model="resourceFilters.id"
                          @clear="getFilteredResources" @keyup.enter.native="getFilteredResources">
                    <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                </el-input>
            </el-col>
            <el-col :md="7">
                <el-input placeholder="输入 广告id 查询" clearable v-model="resourceFilters.item_id"
                          @clear="getFilteredResources" @keyup.enter.native="getFilteredResources">
                    <el-button slot="append" icon="el-icon-search" @click="getFilteredResources"></el-button>
                </el-input>
            </el-col>
            <el-col :md="24">
                <el-row type="display-flex" justify="start" align="center">
                    <el-col :md="2"><span class="total-resource-num">筛选</span></el-col>
                    <el-date-picker
                            v-model="resourcesDateRange"
                            type="daterange"
                            :clearable="true"
                            @change="getFilteredResources"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>

                    <el-select v-model="resourceFilters.status"
                               @change="getFilteredResources"
                               clearable
                               placeholder="订单状态">
                        <el-option
                                v-for="(status,index) in orderStatusTypes"
                                :key="index"
                                :label="status.text"
                                :value="status.value">
                        </el-option>
                    </el-select>

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

                </el-row>
            </el-col>
        </el-row>

        <el-table
                class="with-margin-top"
                :data="resources"
                @sort-change="sortChange"
                style="width: 100%">
            <el-table-column v-for="(column, index) in columns"
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
                    <router-link :to="'/orders/'+scope.row['id']">
                        <el-button type="primary" class="view-detail">查看详情</el-button>
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
  import {timeToLocale} from '~/common/utilities';
  import {orderStatusTypes, appealStatusTypes, coinTypes} from '~/common/constants';

  export default {
    layout: 'default',
    data() {
      return {
        orderStatusTypes,
        appealStatusTypes,
        coinTypes,
        columns: [{
          prop: 'id',
          label: '订单编号',
          width: 50,
          link: '/orders'
        }, {
          prop: 'create_time',
          label: '下单时间',
          width: 110,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue);
          },
        }, {
          prop: 'status',
          label: '订单状态',
          formatter: (row, column, cellValue) => {
            return this.itemText(cellValue, orderStatusTypes);
          },
          width: 90,
        }, {
          prop: 'buy_user',
          label: '买方',
          width: 80,
          link: '/users',
          text: 'name',
        }, {
          prop: 'sell_user',
          label: '卖方',
          width: 80,
          link: '/users',
          text: 'name',
        }, {
          prop: 'maker',
          label: '广告方',
        }, {
          prop: 'coin_type',
          label: '币种',
          width: 60,
        }, {
          prop: 'coin_amount',
          label: '数量',
          width: 100,
        }, {
          prop: 'price',
          label: '价格',
        }]
      };
    },
    mounted() {
      this.initResources('orders', () => {
        if (this.resources && this.resources.length > 0) {
          if (this.resources.length === 1) {
            return this.$router.push(`/orders/${this.resources[0].id}`);
          }
          this.resources.forEach(order => {
            if (order.merchant_side === 'sell') {
              order.sell_user = order.merchant;
              order.sell_user.isMaker = true;
              order.maker = '卖方';
              order.buy_user = order.user;
            } else {
              order.sell_user = order.user;
              order.buy_user = order.merchant;
              order.buy_user.isMaker = true;
              order.maker = '买方';
            }
          });
        }
      }, {
        user_id: this.$route.query.user_id,
        item_id: this.$route.query.item_id,
      });
    },
    methods: {}
  };
</script>
<style lang="scss" scoped>
    .view-snapshot {
        padding: 12px 8px;
    }
</style>
<style lang="scss">

</style>
