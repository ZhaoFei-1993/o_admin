<template>

    <el-table
            class="with-margin-top"
            :data="users"
            style="width: 100%">
        <el-table-column v-for="(column, index) in itemColumns"
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
                <router-link :to="column.link+(column.text?scope.row[column.prop]['id']:scope.row['id'])">{{column.text?scope.row[column.prop][column.text]:scope.row[column.prop]}}</router-link>
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

</template>
<script>
  import {is_2fa, timeToLocale} from "../common/utilities";

  export default {
    data() {
      return {
        orderColumns: [{
          prop: 'id',
          label: 'ID',
          width: 50,
        }, {
          prop: 'create_time',
          label: '注册时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
          sortable: true,
          className: 'time',
        }, {
          prop: 'name',
          label: '用户名',
          width: 100,
          link: this.withLink ? '/admin/?account=' : null,
        }, {
          prop: 'email',
          label: '邮箱',
          width: 160,
        }, {
          prop: 'phone',
          label: '手机',
          width: 160,
        }, {
          prop: 'is_2fa',
          label: '2FA',
          width: 60,
          formatter: (row, column, cellValue) => {
            return is_2fa(cellValue);
          },
        }]
      }
    },
    methods: {},
    props: ['users', 'withLink'],
  }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
</style>