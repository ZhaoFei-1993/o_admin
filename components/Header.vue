<template>
    <div class="header">
        <div class="left-side">
            <i :class="[sidenavOpened?'icon-left-circle-o':'icon-right-circle-o','toggle','iconfont']"
               @click="toggleSidenav"></i>
            <router-link to="/"><img style="height: 36px;" src="~assets/img/logo/hd_logo.png"/></router-link>
        </div>
        <!--<div hidden class="center-nav">-->
        <!--<el-menu :router="true" class="el-menu-demo" mode="horizontal">-->
        <!--<el-menu-item index="/">矿机</el-menu-item>-->
        <!--<el-menu-item index="/pool">矿池</el-menu-item>-->
        <!--<el-menu-item index="/coinex">交易所</el-menu-item>-->
        <!--</el-menu>-->
        <!--</div>-->
        <div class="right-side">
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
    mapState,
  } from 'vuex';
  import {loginURL} from '../common/constants';

  export default {
    computed: {
      ...mapState(['user'])
    },
    head: {
      link: [{rel: 'stylesheet', href: '//at.alicdn.com/t/font_702301_jaydxd42e09.css'}]
    },
    methods: {
      toggleSidenav() {
        this.$emit('toggleSidenav');
      },
      login() {
        window.location.href = loginURL;
      },
      logout() {
        this.$store.dispatch('chat/logout').then(() => {
          this.$store.dispatch('user/signOut');
        }).catch(err => {
          console.error(`IM退出失败${err}`);
          this.$store.dispatch('user/signOut');
        });
      },
      checkLogin() {
        if (window.location.href.indexOf('/forbidden') >= 0) {
          return;
        }
        this.$store.dispatch('user/fetchUserAccount');
      }
    },
    mounted() {
      this.checkLogin();
    },
    props: ['sidenavOpened', 'iframeMode'],
  };
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
            width: 182px;
            height: 54px;
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
        }

    }
</style>
