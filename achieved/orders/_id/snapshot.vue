<template>
    <div class="main-content">
        <h1>交易
            <router-link :to="'/orders/'+id">{{id}}</router-link>
            的快照
        </h1>
        <template v-if="currentResource">
            <div class="item-control">
                <span class="section-tip">基本信息</span>
            </div>
            <div>
                <DetailTable :properties="itemProps" :detailResource="currentResource"></DetailTable>
            </div>
            <div class="item-description">
                <p class="section-tip">产品描述</p>
                <p>{{currentResource.detail}}</p>
            </div>
            <div class="item-description">
                <p class="section-tip">产品图片</p>
                <el-row>
                    <el-col :md="12" :lg="8" v-for="(img,index) in currentResource.images" :key="index"
                            class="image-container">
                        <img :src="img" class="item-image"/>
                    </el-col>
                </el-row>
            </div>
        </template>
        <template v-else>
            <h4>加载中</h4>
        </template>
    </div>
</template>
<script>
  import DetailTable from "~/components/DetailTable";
  import {snapshotProps} from "../../../common/constants";

  export default {
    components: {
      DetailTable
    },
    mounted() {
      this.loadingSingleResource = true;
      this.$axios.get(`/orders/${this.id}/snapshot`).then(response => {
        this.loadingSingleResource = false;
        this.currentResource = response.data.data;
        this.currentResource.user = this.currentResource.sell_user;
      }).catch(e => {
        this.loadingSingleResource = false;
      });
    },
    data() {
      return {
        id: this.$route.params.id,
        itemProps: snapshotProps,
      }
    },
    methods: {}
  }
</script>
<style lang="scss" scoped>


    .image-container {
        padding: 1rem;
        .item-image {
            max-width: 100%;
            max-height: 300px;
        }
        label {
            display: block;
            text-align: center;
            margin-top: 0.5rem;
            color: #555;
        }
    }


</style>