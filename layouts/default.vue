<template>
    <div id="app">
        <el-container>
            <el-aside :width="sidenavOpened?'160px':'52px'">
                <Sidenav :sidenavOpened="sidenavOpened"></Sidenav>
            </el-aside>
            <el-container>
                <el-header>
                    <Header :sidenavOpened="sidenavOpened" v-on:toggleSidenav="toggleSidenav"></Header>
                </el-header>
                <el-main>
                    <nuxt/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
  import Sidenav from '~/components/Sidenav.vue';
  import Header from '~/components/Header.vue';

  export default {
    components: {
      Sidenav,
      Header,
    },
    data() {
      return {
        sidenavOpened: true,
      }
    },
    methods: {
      toggleSidenav() {
        this.sidenavOpened = !this.sidenavOpened;
      }
    }
  }
</script>
<style lang="scss" scoped>
    #app {
        height: 100%;
    }
</style>