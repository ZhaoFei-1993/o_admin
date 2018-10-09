<template>
    <div class="main-content">
        <h1>{{category.label}}统计</h1>
        <el-row type="flex" justify="start">
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
                        v-for="(filter,index) in category.filters"
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
        <el-tabs class="with-margin-top" type="border-card">
            <el-tab-pane label="表格展示">
                <StatsTable :data="statsData" :columns="category.columns"></StatsTable>
                <no-ssr>
                    <el-pagination
                            class="with-margin-top"
                            background
                            layout="prev, pager, next"
                            :page-size="30"
                            @current-change="changeStatsPage"
                            :current-page.sync="pageNum"
                            :total="totalNum">
                    </el-pagination>
                </no-ssr>
            </el-tab-pane>
            <el-tab-pane v-if="chartOption" label="图形展示">
                <div class="chart-container">
                    <chart :options="chartOption" style=" width: 100%;height: 530px;" :autoResize="true"></chart>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
  import StatsTable from '~/components/StatsTable';
  // import {areaStackChartOption} from '~/common/utilities';
  import {statsCategories, statsProps, statsPeriodTypes} from '~/common/constants';

  export default {
    components: {
      StatsTable
    },
    data() {
      const categoryName = this.$route.params.category;
      return {
        statsPeriodTypes,
        categoryName,
        category: statsProps[categoryName],
        chartOption: null,
      };
    },
    computed: {
      sortedData() {
        return this.statsData.slice(0).sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    },
    mounted() {
      if (statsCategories.indexOf(this.categoryName) < 0) {
        this.$router.push('/404');
      }
      const query = {};
      if (this.category.filters) {
        this.category.filters.forEach(item => {
          query[item.name] = item.value;
        });
      }
      this.initStats(
        this.category.link,
        null,
        query,
      );
    }
  };
</script>
<style lang="scss">
    .stats-filters {
        margin-bottom: 1rem;
    }

    .stats-switcher {
        height: 40px;
    }
</style>
