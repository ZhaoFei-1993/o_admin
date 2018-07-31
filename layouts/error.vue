<template>
    <div id="app">

        <el-main>
            <div class="page-error">
                <div class="content">
                    <template v-if="error.statusCode === 404">
                        <img class="img-404" src="~assets/img/svg/error/404.svg" alt="">
                        <p class="msg">Whoops…Page Not Found !!!</p>
                    </template>
                    <template v-if="error.statusCode === 500">
                        <img class="img-500" src="~assets/img/svg/error/500.svg" alt="">
                        <p class="msg">Whoops…Page Error !!!</p>
                    </template>
                </div>
            </div>
        </el-main>

    </div>
</template>

<script>
  import Sidenav from '~/components/Sidenav.vue';
  import Header from '~/components/Header.vue';

  export default {
    props: ["error"],
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
    .page-error {
        padding-top: 44px;
        padding-bottom: 49px;
        .content {
            width: 100%;
            height: 617px;
            padding-top: 180px;
            margin: 0 auto;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 1617px 617px;
            background-image: url("~assets/img/svg/error/background.svg");

            .img-404,
            .img-500 {
                max-width: 100%;
                display: block;
                margin: 0 auto;
            }
            .img-500 {
                margin-top: -55px;
            }
            .msg {
                margin-top: 20px;
                font-size: 18px;
                font-weight: 500;
                color: #53cbca;
                text-align: center;
            }
        }
    }

</style>
