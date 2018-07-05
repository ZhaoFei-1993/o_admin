<template>
    <div class="main-content">
        <h1>{{category.label}}统计</h1>
        <el-row type="flex" justify="end">
            <el-col :span="4">
                <el-switch
                        v-model="statsByMonth"
                        class="stats-switcher"
                        active-text="月报"
                        @change="getFilteredStats"
                        inactive-text="日报">
                </el-switch>
            </el-col>
            <no-ssr>
                <el-col :span="10">
                            <span v-show="statsByMonth">
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
                    <span v-show="!statsByMonth">
                                <el-date-picker
                                        v-model="statsRange"
                                        type="daterange"
                                        :clearable="false"
                                        @change="getFilteredStats"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </span>
                </el-col>
            </no-ssr>
            <el-col v-if="showProduct" :span="5">
                <el-select v-model="statsFilters.kind_category_id"
                           @change="getFilteredStats"
                           placeholder="产品类型">
                    <el-option
                            v-for="(product,index) in productTypes"
                            :key="index+1"
                            :label="product"
                            :value="index+1">
                    </el-option>
                </el-select>
            </el-col>

            <el-col v-if="showCoin" :span="5">
                <el-select v-model="statsFilters.coin_type"
                           @change="getFilteredStats"
                           placeholder="收入币种">
                    <el-option
                            v-for="(stats,index) in coinNames"
                            :key="index"
                            :label="stats"
                            :value="index">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-tabs class="with-margin-top" type="border-card">
            <el-tab-pane label="表格展示">
                <StatsTable :data="statsData" :columns="stats_colums"></StatsTable>
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
  import StatsTable from "~/components/StatsTable"
  import {areaStackChartOption} from "../../common/utilities";
  import {coinNames, productTypes, statsProps, statsTypes} from "../../common/constants";

  export default {
    components: {
      StatsTable
    },
    data() {
      const categoryName = this.$route.params.category;
      return {
        categoryName: categoryName,
        category: statsProps[categoryName],
        productTypes: productTypes,
        statsTypes: statsTypes,
        coinNames: coinNames,
        stats_colums: statsProps[categoryName].columns,
        chartOption: null,
        showCoin: categoryName === "incomes",
        showProduct: categoryName === "items" || categoryName === "orders",
      }
    },
    computed: {
      sortedData() {
        return this.statsData.slice(0).sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    },
    mounted() {
      this.initStats(
        this.category.link,
        () => {
          this.chartOption = areaStackChartOption(this.sortedData, {
            title: this.category.label + '趋势堆叠图',
            xAxis: this.stats_colums.find(c => c.xAxis),
            yAxisLines: this.stats_colums.filter(c => c.chartLine),
          });
        });
    }
  }
</script>
<style lang="scss">
    .stats-filters {
        margin-bottom: 1rem;
    }

    .stats-switcher {
        height: 40px;
    }
</style>