<template>
    <div class="main-content">
        <h1>挂单挖矿</h1>

        <el-tabs type="border-card" v-model="currentTab" @tab-click="tabClick" class="with-margin-top">
            <el-tab-pane label="查看榜单" name="rank">
                <el-row type="flex" justify="start">
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-date-picker
                                v-model="miningDate"
                                type="date"
                                :clearable="false"
                                @change="getMiningRank"
                                default-time="00:00:00"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-col>

                </el-row>
                <el-table
                        class="with-margin-top"
                        :data="rankList"
                        style="width: 100%">
                    <el-table-column
                            key="id"
                            label="用户ID"
                    >
                        <template slot-scope="scope">
                            <router-link :to="'/users/'+scope.row['user_id']">
                                {{ scope.row['user_id']}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(column, index) in rankColumns"
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
                            <router-link :to="'/activities/mining?tab=history&user_id='+scope.row['user_id']">
                                <el-button type="primary" class="view-detail"
                                           @click="getUserMining(scope.row['user_id'])">
                                    挖矿记录
                                </el-button>
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="用户挖矿" name="history">
                <el-row type="flex" justify="start">
                    <el-col :md="8" :lg="6" class="resource-filter">
                        <el-input placeholder="输入 用户ID 查询" clearable v-model="userId"
                                  @clear="getUserMining">
                            <el-button slot="append" icon="el-icon-search" @click="getUserMining(userId)"></el-button>
                        </el-input>
                    </el-col>

                </el-row>
                <el-table
                        class="with-margin-top"
                        :data="userMining"
                        style="width: 100%">
                    <el-table-column v-for="(column, index) in userMiningColumns"
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
                        :current-page.sync="page"
                        :total="total">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>


    </div>
</template>
<script>
  import {sides, coinTypes, paymentTypes, itemStatusTypes} from '~/common/constants';
  import {timeToLocale, getDate} from '~/common/utilities';

  export default {
    layout: 'default',
    data() {
      return {
        sides,
        coinTypes,
        paymentTypes,
        itemStatusTypes,
        rankList: null,
        rankColumns: [{
          prop: 'username',
          label: '用户名',
        }, {
          prop: 'sort',
          label: '当日排名',
        }, {
          prop: 'score',
          label: '当日积分',
        }, {
          prop: 'trading_amount',
          label: '当日成交额',
        }, {
          prop: 'award_amount',
          label: '当日获得奖励',
          formatter(row, col, cell) {
            return cell || '--';
          }
        }],
        userMiningColumns: [{
          prop: 'date',
          label: '日期',
          formatter(row, col, cell) {
            return timeToLocale(cell);
          }
        }, {
          prop: 'sort',
          label: '当日排名',
        }, {
          prop: 'score',
          label: '当日积分',
        }, {
          prop: 'award_amount',
          label: '当日获得奖励',
          formatter(row, col, cell) {
            return cell || '--';
          }
        }],
        userId: this.$route.query.user_id,
        miningDate: getDate(),
        currentTab: this.$route.query.tab || 'rank',
        userMining: null,
        page: 1,
        total: 1,
      };
    },
    mounted() {
      this.loadData();
    },
    methods: {
      loadData() {
        if (this.currentTab === 'rank') {
          this.getMiningRank();
        } else {
          this.getUserMining();
        }
      },
      getUserMining(userId) {
        this.currentTab = 'history';
        this.userId = userId;
        this.$router.replace({
          query: {...this.$route.query, user_id: this.userId || undefined}
        });
        if (!this.userId) {
          this.userMining = null;
          return;
        }
        this.$axios.get(`/mining/${this.userId}`).then(res => {
          this.total = res.data.data.total;
          this.userMining = res.data.data.data;
        });
      },
      getMiningRank() {
        // 后端分成两个接口的。。。
        if (getDate(this.miningDate).getTime() === getDate().getTime()) {
          this.$axios.get('/mining/rank').then(res => {
            this.rankList = res.data.data;
          });
        } else {
          this.$axios.get('/mining/history', {
            params: {
              date: getDate(this.miningDate).getTime() / 1000
            }
          }).then(res => {
            this.rankList = res.data.data;
          });
        }
      },
      tabClick(tab) {
        this.currentTab = tab.name;
        this.loadData();
        this.$router.replace({
          query: {...this.$route.query, tab: tab.name}
        });
      },
    }
  };
</script>
<style lang="scss" scoped>

</style>
