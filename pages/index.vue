<template>
    <div class="main-content">
        <h1>状态监控</h1>
        <p>可以在这里实时显示各产品当前的状态，例如：用户数，cpu占用，错误日志</p>
    </div>
</template>

<script>
  import {checkAuth} from "../common/utilities";

  export default {
    layout: 'default',
    mounted() {
      checkAuth(this.$axios, this.$store);
    }
  }
</script>
<style lang="scss" scoped>
    .size-test {
        background-color: #7f828b;
    }
</style>