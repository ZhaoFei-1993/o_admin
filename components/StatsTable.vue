<template>
    <div class="stats-container">
        <el-table :data="data"
                  style="width: 100%"
                  class="stats-table">
            <el-table-column v-for="(column,index) in columns"
                             v-if="!column.hidden"
                             :key="index"
                             :prop="column.prop"
                             :label="column.label"
                             :sortable="column.sortable"
                             :formatter="column.formatter">
            </el-table-column>
        </el-table>


    </div>
</template>
<script>
  export default {
    props: ['data', 'columns', 'chartOption', 'hideTable'],
  };
</script>