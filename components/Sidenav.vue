<template>
    <div class="side-nav">
        <el-menu
                class='nav-menu'
                :collapse-transition="false"
                background-color="#545c64"
                :router="true"
                text-color="#fff"
                :default-active="activeIndex"
                :collapse="!sidenavOpened">
            <el-menu-item index="/users">
                <i class="iconfont icon-team"></i>
                <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/orders">
                <i class="iconfont icon-detail"></i>
                <span slot="title">订单管理</span>
            </el-menu-item>
            <el-menu-item index="/operations/appeals">
                <i class="iconfont icon-customerservice"></i>
                <span slot="title">申诉管理</span>
            </el-menu-item>
            <el-menu-item index="/items">
                <i class="iconfont icon-barcode"></i>
                <span slot="title">广告管理</span>
            </el-menu-item>
            <el-menu-item index="/operations/merchants">
                <i class="iconfont icon-audit"></i>
                <span slot="title">商家审核</span>
            </el-menu-item>
            <el-submenu index="/statistics">
                <template slot="title">
                    <i class="iconfont icon-snippets"></i>
                    <span>统计报表</span>
                </template>
                <el-menu-item index="/statistics/item">广告统计</el-menu-item>
                <el-menu-item index="/statistics/order">订单统计</el-menu-item>
                <el-menu-item index="/statistics/user">用户统计</el-menu-item>
                <el-menu-item index="/statistics/merchant">商家统计</el-menu-item>
                <el-menu-item index="/activities/gift">奖励统计</el-menu-item>
                <el-menu-item index="/activities/mining">
                    挖矿活动
                </el-menu-item>
            </el-submenu>
<!-- 后端还没发，暂时屏蔽入口
            <el-menu-item index="/managers">
                <i class="iconfont icon-team"></i>
                <span slot="title">管理员管理</span>
            </el-menu-item>
             -->
            <el-menu-item index="/configs">
                <i class="iconfont icon-setting"></i>
                <span slot="title">配置管理</span>
            </el-menu-item>
            <el-submenu hidden index="/accounting">
                <template slot="title">
                    <i class="iconfont icon-YUAN"></i>
                    <span>财务管理</span>
                </template>
                <el-menu-item index="/accounting/payments">付款核实</el-menu-item>
                <el-menu-item index="/accounting/settlements">卖家结算</el-menu-item>
                <el-menu-item index="/accounting/refunds">买家退款</el-menu-item>
            </el-submenu>
            <el-submenu hidden index="/sells">
                <template slot="title">
                    <i class="iconfont icon-idcard"></i>
                    <span>卖家管理</span>
                </template>
                <el-menu-item index="/sellers">卖家列表</el-menu-item>
                <el-menu-item index="/sellers/authentication">卖家审核</el-menu-item>
            </el-submenu>
            <!--<el-submenu index="/operations">-->
            <!--<template slot="title">-->
            <!--<i class="iconfont icon-fileprotect"></i>-->
            <!--<span>运营中心</span>-->
            <!--</template>-->
            <!---->
            <!--</el-submenu>-->


            <el-menu-item hidden index="/incomes">
                <i class="iconfont icon-moneycollect"></i>
                <span slot="title">广告收入</span>
            </el-menu-item>
            <el-menu-item hidden index="/announcements">
                <i class="iconfont icon-notification"></i>
                <span slot="title">公告管理</span>
            </el-menu-item>
            <el-menu-item hidden index="/brands">
                <i class="iconfont icon-tag"></i>
                <span slot="title">品牌型号</span>
            </el-menu-item>


        </el-menu>
    </div>
</template>
<script>
  export default {
    props: ['sidenavOpened'],
    computed: {
      activeIndex() {
        return this.$route.path;
      },
    },
  };
</script>
<style lang="scss" scoped>
    .side-nav {
        width: 100%;
        background-color: #545c64;
        height: 100%;
        .nav-menu {
            border-right: none;
        }
    }
</style>
