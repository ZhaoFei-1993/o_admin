<template>
    <div class="main-content">
        <h1>
            <router-link :to="'/items/'+id">广告 {{id}}</router-link>
            操作记录
        </h1>
        <el-table
                class="with-margin-top"
                :data="resources"
                style="width: 100%">
            <el-table-column v-for="(column,index) in operationColumns"
                             v-if="column.link && !column.hidden"
                             :key="index"
                             :prop="column.prop"
                             :label="column.label"
                             :sortable="column.sortable"
                             :formatter="column.formatter">
                <template slot-scope="scope">
                    <router-link :to="column.link+(column.text?scope.row[column.prop]['id']:scope.row['id'])+'/'">
                        {{column.text?scope.row[column.prop][column.text]:scope.row[column.prop]}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column v-else-if="!column.hidden"
                             :key="index"
                             :prop="column.prop"
                             :label="column.label"
                             :sortable="column.sortable"
                             :formatter="column.formatter">
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
  import {timeToLocale} from "~/common/utilities";
  import {itemOperationTypes, adminUsers} from "~/common/constants";

  export default {
    data() {
      return {
        id: this.$route.params['id'],
        operationColumns: [
          {
            label: '时间',
            prop: 'create_time',
            formatter: (row, column, cellValue) => {
              return timeToLocale(cellValue)
            },
            sortable: true,
          },
          {label: '用户', prop: 'user', link: adminUsers, text: 'username'},
          {
            label: '事件',
            prop: 'event',
            formatter: (row, column, cellValue) => {
              return itemOperationTypes[cellValue]
            },
            sortable: true,
          },
          {label: '备注', prop: 'comment'},
        ]
      }
    },
    mounted() {
      this.initResources(`items/${this.id}/operations`)
    }
  }
</script>
<style lang="scss" scoped>
</style>