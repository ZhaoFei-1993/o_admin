<template>
    <div class="main-content page-order-detail">
        <h1>广告详情 --- {{currentResourceId}}</h1>
        <template v-if="currentResource">
            <el-card class="order-info">
                <div class="info-block">
                    <div class="info-header">广告信息</div>
                    <el-row>
                        <el-col :span="3">状态</el-col>
                        <el-col :span="9">
                            {{currentResource.status | itemText(itemStatusTypes)}}
                        </el-col>
                        <el-col :span="3">上架时间</el-col>
                        <el-col :span="9">
                            {{currentResource.on_time | formatTime}}
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="3">创建时间</el-col>
                        <el-col :span="9">
                            {{currentResource.create_time | formatTime}}
                        </el-col>
                        <el-col :span="3">更新时间</el-col>
                        <el-col :span="9">
                            {{currentResource.update_time | formatTime}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">广告ID</el-col>
                        <el-col :span="9">
                            {{currentResource.id}}
                        </el-col>
                        <el-col :span="3">版本号</el-col>
                        <el-col :span="9">
                            {{currentResource.version}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">发布商家</el-col>
                        <el-col :span="9">
                            <router-link :to="`/users/${currentResource.user_id}`">{{currentResource.user_id}}
                            </router-link>
                        </el-col>
                        <el-col :span="3">类型</el-col>
                        <el-col :span="9">
                            {{currentResource.side | itemText(sides)}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">法币币种</el-col>
                        <el-col :span="9">
                            {{currentResource.cash_type}}
                        </el-col>
                        <el-col :span="3">数字货币币种</el-col>
                        <el-col :span="9">
                            {{currentResource.coin_type}}
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="3">定价方式</el-col>
                        <el-col :span="9">
                            {{currentResource.pricing_type | itemText(pricingTypes)}}
                        </el-col>
                        <el-col :span="3">溢价比</el-col>
                        <el-col :span="9">
                            {{currentResource.float_rate}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">价格</el-col>
                        <el-col :span="9">
                            {{currentResource.price}}
                        </el-col>
                        <el-col :span="3">最高/最低价格</el-col>
                        <el-col :span="9">
                            {{currentResource.price_limit}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">买卖币量</el-col>
                        <el-col :span="9">
                            {{currentResource.coin_amount}}
                        </el-col>
                        <el-col :span="3">库存币量</el-col>
                        <el-col :span="9">
                            {{currentResource.remain_coin_amount}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">冻结币量</el-col>
                        <el-col :span="9">
                            {{currentResource.freeze_coin_amount}}
                        </el-col>
                        <el-col :span="3">交易对手限制</el-col>
                        <el-col :span="9">
                            {{counterpartyLimit}}
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="3">最小交易额</el-col>
                        <el-col :span="9">
                            {{currentResource.min_deal_cash_amount}}
                        </el-col>
                        <el-col :span="3">最大交易额</el-col>
                        <el-col :span="9">
                            {{currentResource.max_deal_cash_amount}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">自动回复内容</el-col>
                        <el-col :span="21">
                            {{currentResource.auto_reply_content}}
                        </el-col>
                    </el-row>
                </div>
            </el-card>

        </template>
        <template v-else>
            <h4>加载中</h4>
        </template>
    </div>
</template>
<script>
  import {sides, pricingTypes, itemStatusTypes, counterpartyLimitTypes} from "~/common/constants";
  import {findMatchedItems} from "../../../common/utilities";

  export default {
    components: {},
    data() {
      return {
        sides,
        pricingTypes,
        itemStatusTypes,
        id: this.$route.params.id,
      }
    },
    computed: {
      counterpartyLimit() {
        return findMatchedItems(this.currentResource.counterparty_limit, counterpartyLimitTypes).map(o => o.text).join(', ')
      }
    },
    mounted() {
      this.initData();
    },
    methods: {
      initData() {
        this.initCurrentResource('items', this.id, response => {
          if (!response.data) {
            this.$message('获取广告信息失败，请联系开发人员')
          }
        });
      },
    }
  }
</script>