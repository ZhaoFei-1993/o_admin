<template>
    <div class="header">
        <div class="left-side">
            <i v-if="!iframeMode"
               :class="[sidenavOpened?'icon-left-circle-o':'icon-right-circle-o','toggle','iconfont']"
               @click="toggleSidenav"></i>
            <router-link to="/"><img class="logo" src="~assets/img/logo/hd_logo.png"/></router-link>
        </div>
        <!--<div hidden class="center-nav">-->
        <!--<el-menu :router="true" class="el-menu-demo" mode="horizontal">-->
        <!--<el-menu-item index="/">矿机</el-menu-item>-->
        <!--<el-menu-item index="/pool">矿池</el-menu-item>-->
        <!--<el-menu-item index="/coinex">交易所</el-menu-item>-->
        <!--</el-menu>-->
        <!--</div>-->
        <div class="right-side" v-if="!iframeMode">
            <template v-if="user.account">
                <el-tag type="danger" v-if="isSuperAdmin">超级管理员</el-tag>
                <el-tag type="warning" v-else>管理员</el-tag>
                <span>{{user.account.name}}</span>
                <el-button @click="logout">退出登录</el-button>
            </template>

            <el-button v-else @click="login">登录</el-button>
        </div>
    </div>
</template>
<script>
  import {
    mapState
  } from "vuex";
  import {deleteAllCookies} from "../common/utilities";
  import cookies from "../plugins/cookies";
  import {loginURL} from "../common/constants";
  import {checkAuth} from "../common/utilities";

  export default {
    computed: {
      ...mapState(['user', 'chat'])
    },
    methods: {
      toggleSidenav() {
        this.$emit('toggleSidenav')
      },
      login() {
        window.location.href = loginURL;
      },
      logout() {
        this.$store.dispatch('user/signOut')
      },
      checkLogin() {
        if (window.location.href.indexOf('/forbidden') >= 0) {
          return;
        }
        this.$store.dispatch('user/fetchUserAccount').then(_ => {
          if (this.user.account && !this.chat.imClient) {
            const clientId = `${this.user.account.id}`
            this.$store.dispatch('chat/newChatClient', clientId)
          }
        })
      }
    },
    mounted() {
      this.checkLogin()
    },
    props: ['sidenavOpened', 'iframeMode'],
  }
</script>
<style lang="scss" scoped>
    .header {
        height: 100%;
        width: 100%;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: white;
        box-shadow: 0 2px 4px 0 rgba(94, 94, 94, 0.15);

        .left-side {
            display: flex;
            align-items: center;
            i.toggle {
                margin-right: 1rem;
                width: 36px;
                font-size: 36px;
                cursor: pointer;
                color: #e6e6e6;
                &:hover {
                    color: #ddd;
                }
            }
            .logo {
                height: 36px;
            }
        }

    }
</style>