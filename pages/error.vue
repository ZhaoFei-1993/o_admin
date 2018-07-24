<template>
    <div>
        <p class="forbidden-warning">
            <el-icon class="el-icon-warning"></el-icon>
            服务器出错，请联系技术人员
        </p>
    </div>
</template>
<script>
  export default {
    layout: 'iframe',
  }
</script>
<style lang="scss" scoped>
    .forbidden-warning {
        text-align: center;
        margin: 3rem auto;
        font-size: 20px;
    }
</style>