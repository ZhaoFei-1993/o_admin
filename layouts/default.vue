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
                    <div id="chat-list-container">
                        <ChatList></ChatList>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
  import Sidenav from '~/components/Sidenav.vue';
  import Header from '~/components/Header.vue';
  import ChatList from '~/components/chat-list';

  export default {
    components: {
      Sidenav,
      Header,
      ChatList,
    },
    data() {
      return {
        sidenavOpened: true,
      };
    },
    methods: {
      toggleSidenav() {
        this.sidenavOpened = !this.sidenavOpened;
      }
    }
  };
</script>
<style lang="scss">
    #app {
        height: 100%;
        #chat-list-container {
            z-index: 1;
            position: fixed;
            bottom: 20px;
            right: 20px;
            i.iconfont {
                margin-right: 0;
            }
            .chat-list > ul {
                padding: 0;
            }
        }
    }
</style>