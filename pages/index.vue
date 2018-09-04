<template>
    <div class="main-content">
        <h1>欢迎回来</h1>
    </div>
</template>

<script>
  export default {
    layout: 'default',
    beforeCreate() {
      this.$router.replace('/users');
    },
  };
</script>
<style lang="scss" scoped>
    .size-test {
        background-color: #7f828b;
    }
</style>