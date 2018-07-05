<template>
    <div id="app">
        <el-container>
            <el-header>
                <Header :sidenavOpened="sidenavOpened" :iframeMode="true"></Header>
            </el-header>
            <el-main>
                <nuxt/>
            </el-main>
        </el-container>
    </div>
</template>

<script>
  import Header from '~/components/Header.vue';

  export default {
    components: {
      Header,
    },
    data() {
      return {
        sidenavOpened: false,
      }
    }
  }
</script>
<style lang="scss" scoped>
    #app {
        height: 100%;
    }
</style>