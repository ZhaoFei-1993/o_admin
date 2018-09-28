<template>
    <div class="main-content">
        <h1>奖励统计</h1>

        <el-tabs type="border-card" v-model="currentTab" @tab-click="tabClick" class="with-margin-top">
            <el-tab-pane label="奖励发放统计" name="gift">
                <el-row type="flex" justify="start" style="margin-bottom: 20px;">
                    <el-col :span="4">
                        <el-select v-model="statsPeriod"
                                   @change="getFilteredStats"
                                   placeholder="统计周期">
                            <el-option
                                    v-for="(period,index) in statsPeriodTypes"
                                    :key="index"
                                    :label="period.text"
                                    :value="period.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <no-ssr>
                        <el-col :span="10">
                    <span v-if="statsPeriod==='monthly'">
                        <el-date-picker
                                v-model="statsRange[0]"
                                type="month"
                                :clearable="false"
                                @change="getFilteredStats"
                                placeholder="开始月">
                        </el-date-picker>
                        <el-date-picker
                                v-model="statsRange[1]"
                                type="month"
                                :clearable="false"
                                @change="getFilteredStats"
                                placeholder="结束月">
                        </el-date-picker>
                    </span>
                            <span v-if="statsPeriod==='weekly'">
                        <el-date-picker
                                v-model="statsRange[0]"
                                type="week"
                                :clearable="false"
                                @change="changeStatsRange"
                                placeholder="开始周">
                        </el-date-picker>
                        <el-date-picker
                                v-model="statsRange[1]"
                                type="week"
                                :clearable="false"
                                @change="changeStatsRange"
                                placeholder="结束周">
                        </el-date-picker>
                    </span>
                            <span v-if="statsPeriod==='daily'">
                                <el-date-picker
                                        v-model="statsRange"
                                        type="daterange"
                                        :clearable="false"
                                        @change="changeStatsRange"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </span>
                        </el-col>
                    </no-ssr>
                    <el-col :span="10">
                        <el-select
                                v-for="(filter,index) in filters"
                                :key="index"
                                v-model="statsFilters[filter.name]"
                                @change="getFilteredStats"
                                :clearable="filter.clearable"
                                :placeholder="filter.text">
                            <el-option
                                    v-for="(option,index) in filter.options"
                                    :key="index"
                                    :label="option.text || option"
                                    :value="option.value || option">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <StatsTable :data="statsData" :columns="giftColumns"></StatsTable>
                <no-ssr>
                    <el-pagination
                            class="with-margin-top"
                            background
                            layout="prev, pager, next"
                            @current-change="changeStatsPage"
                            :current-page.sync="pageNum"
                            :total="totalNum">
                    </el-pagination>
                </no-ssr>
            </el-tab-pane>
            <el-tab-pane label="用户奖励记录" name="record">
                <el-row type="flex" justify="start">
                    <el-col :md="12" :lg="10" class="resource-filter">
                        <el-input placeholder="请输入用户昵称/姓名/手机/邮箱/身份证号" clearable v-model="userSearch"
                                  @clear="getUserMining">
                            <el-button slot="append" icon="el-icon-search" @click="getUserMining(userSearch)"></el-button>
                        </el-input>
                    </el-col>
                    <el :span="8">
                        <el-date-picker
                                v-model="statsRange"
                                type="daterange"
                                :clearable="false"
                                @change="changeStatsRange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el>
                    <el-col :span="10">
                        <el-select
                                v-for="(filter,index) in filters"
                                :key="index"
                                v-model="statsFilters[filter.name]"
                                @change="getFilteredStats"
                                :clearable="filter.clearable"
                                :placeholder="filter.text">
                            <el-option
                                    v-for="(option,index) in filter.options"
                                    :key="index"
                                    :label="option.text || option"
                                    :value="option.value || option">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <StatsTable :data="statsData" :columns="recordColumns"></StatsTable>
                <no-ssr>
                    <el-pagination
                            class="with-margin-top"
                            background
                            layout="prev, pager, next"
                            @current-change="changeStatsPage"
                            :current-page.sync="pageNum"
                            :total="totalNum">
                    </el-pagination>
                </no-ssr>
            </el-tab-pane>
        </el-tabs>


    </div>
</template>
<script>
  import {statsPeriodTypes} from '~/common/constants';
  import {timeToLocale} from '~/common/utilities';
  import StatsTable from '../../components/StatsTable';

  export default {
    components: {StatsTable},
    layout: 'default',
    data() {
      return {
        currentTab: this.$route.query.tab || 'gift',
        statsPeriodTypes,
        userSearch: '',
        filters: [
          {
            name: 'business_type',
            text: '类型',
            value: 'ALL',
            options: ['ALL', 'first_award', 'mining_award'],
            clearable: true,
          },
          {
            name: 'coin_type',
            text: '币种',
            value: 'ALL',
            options: ['CET', 'BCH', 'BTC', 'ETH', 'USDT'],
            clearable: true
          },
        ],
        giftColumns: [
          {
            prop: 'report_date',
            label: '时间',
            formatter: (row, col, cell) => {
              return timeToLocale(cell, true);
            }
          },
          {
            prop: 'business_type',
            label: '奖励类型',
          },
          {
            prop: 'coin_type',
            label: '奖励币种'
          },
          {
            prop: 'total_coin_amount',
            label: '累计发放奖励',
            formatter: (row, col, cell) => {
              return cell || '--';
            }
          },
          {
            prop: 'coin_amount',
            label: '新增发放奖励',
            formatter: (row, col, cell) => {
              return cell || '--';
            }
          },
        ],
        recordColumns: [
          {
            prop: 'create_time',
            label: '奖励时间',
            formatter: (row, col, cell) => {
              return timeToLocale(cell);
            }
          },
          {
            prop: 'username',
            label: '用户昵称',
          },
          {
            prop: 'business_type',
            label: '奖励类型',
          },
          {
            prop: 'coin_type',
            label: '奖励币种',
          },
          {
            prop: 'coin_amount',
            label: '奖励数量',
          },
        ],
      };
    },
    mounted() {
      this.loadData();
    },
    methods: {
      loadData() {
        if (this.currentTab === 'gift') {
          this.getGiftsStatistics();
        } else {
          this.getGiftRecord();
        }
      },
      getGiftsStatistics() {
        this.initStats('report/gift/history', null, this.filters);
      },
      getGiftRecord() {
        this.currentTab = 'record';
        this.initStats('users/gift/history', null, this.filters);
      },
      getUserMining() {

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
