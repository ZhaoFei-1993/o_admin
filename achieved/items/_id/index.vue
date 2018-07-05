<template>
    <div class="main-content">
        <h1>广告详情 --- {{currentResourceId||' 加载中'}}</h1>
        <template v-if="currentResource">
            <div class="item-control">
                <span class="section-tip">基本信息</span>
                <div>
                    <el-button type="danger" :disabled="updating||currentResource.status!==4"
                               @click="changeStatus(true)">恢复上架
                    </el-button>
                    <el-button type="warning" :disabled="updating||currentResource.status!==1"
                               @click="forceOff()">下架处理
                    </el-button>
                </div>
            </div>
            <div>
                <DetailTable :properties="itemProps" :detailResource="currentResource"></DetailTable>
            </div>
            <div class="item-description">
                <p class="section-tip">产品描述</p>
                <div v-html="filterXSS(currentResource.detail)"></div>
            </div>
            <div class="item-description">
                <p class="section-tip">产品图片</p>
                <el-row>
                    <el-col :md="12" :lg="8" v-for="(img,index) in currentResource.image_urls" :key="index"
                            class="image-container">
                        <img :src="img" class="item-image"/>
                    </el-col>
                </el-row>
            </div>
        </template>
        <template v-else>
            <h4>加载中</h4>
        </template>
        <el-dialog
                title="下架广告"
                :visible.sync="forceOffDialogVisible"
                width="30%">
            <el-input :rows="4" type="textarea" placeholder="请填写下架原因(五个字符以上)" v-model="forceOffComment"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="forceOffDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmForceOff"
                           :disabled="!forceOffComment||forceOffComment.length<5">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import DetailTable from "~/components/DetailTable";
  import {itemProps} from "../../../common/constants";
  import API from "../../../config/api";
  import xss from 'xss';

  const xssConfig = {
    article: [],
    aside: [],
    b: [],
    bdi: ["dir"],
    bdo: ["dir"],
    big: [],
    blockquote: ["cite"],
    br: [],
    caption: [],
    center: [],
    cite: [],
    code: [],
    col: ["align", "valign", "span", "width"],
    colgroup: ["align", "valign", "span", "width"],
    dd: [],
    del: ["datetime"],
    details: ["open"],
    div: [],
    dl: [],
    dt: [],
    em: [],
    font: ["color", "size", "face"],
    footer: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    header: [],
    hr: [],
    i: [],
    ins: ["datetime"],
    li: [],
    mark: [],
    nav: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    section: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    table: ["width", "border", "align", "valign"],
    tbody: ["align", "valign"],
    td: ["width", "rowspan", "colspan", "align", "valign"],
    tfoot: ["align", "valign"],
    th: ["width", "rowspan", "colspan", "align", "valign"],
    thead: ["align", "valign"],
    tr: ["rowspan", "align", "valign"],
    tt: [],
    u: [],
    ul: [],
  }
  const xssFilter = new xss.FilterXSS(xssConfig);
  export default {
    components: {
      DetailTable
    },
    mounted() {
      this.initCurrentResource('items', this.$route.params.id);
    },
    data() {
      return {
        forceOffDialogVisible: false,
        forceOffComment: '',
        updating: false,
        itemProps: itemProps,
      }
    },
    methods: {
      changeStatus(isOn) {
        this.updating = true;
        this.$axios.patch(API.singleResource('items', this.currentResourceId), {
          operation: isOn ? 11 : 10,
          comment: this.forceOffComment,
        }).then(response => {
          this.updating = false;
          if (response.data.code === 0) {
            this.currentResource.status = isOn ? 1 : 4;
          } else {
            console.log(response.data)
            this.$message.error('改变广告状态失败，请联系攻城狮帮忙debug');
          }
        });
      },
      forceOff() {
        this.forceOffDialogVisible = true;
      },
      confirmForceOff() {
        this.$confirm('确认下架？')
          .then(_ => {
            this.forceOffDialogVisible = false;
            this.changeStatus(false);
          })
          .catch(_ => {
            this.forceOffDialogVisible = false;
          });
      },
      filterXSS(content) {
        return xssFilter.process(content)
      },
    }
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