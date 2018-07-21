<template>
    <div class="manage-brands main-content">
        <div class="formal-brands">
            <h2>管理品牌型号(选择品牌可管理型号)</h2>
            <el-row class="brand-info">
                <el-col :span="4">
                    <el-select v-model="kind_id"
                               @change="selected=>selectKind(selected)"
                               placeholder="产品类型">
                        <el-option
                                v-for="(product,index) in productTypes"
                                :key="index+1"
                                :label="product"
                                :value="index+1">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="currentBrandId" placeholder="选择品牌"
                               :clearable="true"
                               @change="selected=>selectBrand(selected)"
                               class="with-margin-left">
                        <el-option
                                v-for="item in formalBrands"
                                :key="item.id"
                                :label="item.cn_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-tabs class="with-margin-top" v-model="isFormal" @tab-click="changeTab">
                <el-tab-pane label="官方品牌型号管理" name="formal">
                    <el-row>
                        <el-col :sm="24" :lg="12">
                            <div class="categories-tree">
                                <div>已有的官方{{currentBrandId?'型号':'品牌'}}（拖动排序）</div>
                                <el-tree
                                        :data="(currentBrandId?formalModels:formalBrands)"
                                        node-key="categories-tree"
                                        default-expand-all
                                        draggable
                                        :allow-drop="checkDrop"
                                        :render-content="renderCategory"
                                >
                                </el-tree>
                                <el-button class="submit-sort" type="primary" @click="updateSort">更新排序</el-button>
                            </div>
                        </el-col>
                        <el-col :sm="24" :lg="12">
                            <div class="text-center">
                                <b>新建{{currentBrandId?'型号':'品牌'}}</b>
                            </div>
                            <div class="create-brand">
                                <el-form label-width="100px">
                                    <el-form-item label="型号名称" v-if="currentBrandId">
                                        <el-input placeholder="型号" v-model="newBrand.name">
                                        </el-input>
                                    </el-form-item>
                                    <template v-else>
                                        <el-form-item label="简体中文名称">
                                            <el-input placeholder="简体中文" v-model="newBrand.cn_name">
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="繁体中文名称">
                                            <el-input placeholder="繁体中文" v-model="newBrand.hk_name">
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="英文名称">
                                            <el-input placeholder="英文" v-model="newBrand.en_name">
                                            </el-input>
                                        </el-form-item>
                                    </template>

                                    <el-form-item>
                                        <el-button class="submit-brand" :disabled="!canSubmitBrand()" type="primary"
                                                   @click="submitBrand">
                                            创建{{currentBrandId?'型号':'品牌'}}
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="非官方品牌型号管理" name="unformal">
                    <el-row>
                        <el-col :span="12">
                            <div class="categories-tree">
                                <p>选择需要合并到官方类型中的{{currentBrandId?'型号':'品牌'}}</p>
                                <el-tree
                                        :data="(currentBrandId?unformalModels:unformalBrands)"
                                        node-key="unformal-categories-tree"
                                        default-expand-all
                                        check-on-click-node
                                        show-checkbox
                                        ref="unformalTree"
                                        :render-content="renderCategory"
                                >
                                </el-tree>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="merge-target">
                                <el-select v-model="targetCategoryId"
                                           placeholder="合并到目标分类"
                                >
                                    <el-option
                                            v-for="item in (currentBrandId?formalModels:formalBrands)"
                                            :key="item.id"
                                            :label="(item.cn_name||item.name)"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-button type="primary" :disabled="!targetCategoryId" @click="mergeCategories">合并类型
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
  import {productTypes} from "~/common/constants";

  export default {
    data() {
      return {
        newBrand: this.getNewBrand(),
        productTypes: productTypes,
        formalBrands: [],
        formalModels: [],
        unformalBrands: [],
        unformalModels: [],
        currentBrandId: null,
        kind_id: 1,
        isFormal: 'formal',
        targetCategoryId: null,
      }
    },
    computed: {},
    mounted() {
      this.getFormalBrands();
      this.getUnformalBrands();
    },
    methods: {
      getNewBrand(parent_id) {
        return {
          "name": "", // 新建型号分类时，需要该字段
          "cn_name": "", // 新建品牌分类时，需要该字段
          "en_name": "", // 新建品牌分类时，需要该字段
          "hk_name": "", // 新建品牌分类时，需要该字段
          "tag": this.currentBrandId ? 3 : 2, // 类型，见CATEGORY_TAG枚举 2=>品牌 3=>型号
          "parent_id": parent_id || 1, // 上级分类id，1矿机 2电源
        }
      },
      getFormalModels(parent_id) {
        this.$axios.get('/categories', {params: {is_formal: true, parent_id: parent_id}}).then(response => {
          this.formalModels = response.data.data.sort((a, b) => a.sort_id - b.sort_id);
        });
      },
      getFormalBrands(parent_id = this.kind_id) {
        this.$axios.get('/categories', {
          params: {
            is_formal: true,
            parent_id: parent_id
          }
        }).then(response => {
          this.formalBrands = response.data.data.sort((a, b) => a.sort_id - b.sort_id);
        });
      },
      getUnformalModels(parent_id) {
        this.$axios.get('/categories', {params: {is_formal: false, parent_id: parent_id}}).then(response => {
          this.unformalModels = response.data.data;
        });
      },
      getUnformalBrands(parent_id = this.kind_id) {
        this.$axios.get('/categories', {
          params: {
            is_formal: false,
            parent_id: parent_id
          }
        }).then(response => {
          this.unformalBrands = response.data.data;
        });
      },
      submitBrand() {
        this.$axios.post('categories', this.newBrand).then(_ => {
          this.newBrand = this.getNewBrand();
          if (this.currentBrandId) {
            this.getFormalModels(this.currentBrandId)
          } else {
            this.getFormalBrands(this.kind_id)
          }
        })
      },
      mergeCategories() {
        const old_names = this.$refs.unformalTree.getCheckedNodes().map(item => (item.cn_name || item.name))
        const target = (this.currentBrandId ? this.formalModels.find(b => b.id === this.targetCategoryId) : this.formalBrands.find(b => b.id === this.targetCategoryId))
        const target_name = target.cn_name || target.name;
        const old_id = this.$refs.unformalTree.getCheckedNodes().map(item => item.id)
        if (!old_id || !old_id.length) {
          return this.$message('请至少选择一个要合并的分类');
        }
        this.$confirm(`确认将 【${old_names.join('、')}】 合并到【${target_name}】 吗？合并后对应广告都会移到目标分类下，该操作将无法撤销！！`, '确认合并？').then(() => {
          this.$axios.patch('/categories', {old_id: old_id, new_id: this.targetCategoryId}).then(response => {
            if (this.currentBrandId) {
              this.getUnformalModels(this.currentBrandId)
            } else {
              this.getUnformalBrands(this.kind_id)
            }
          })
        })
      },
      canSubmitBrand() {
        if (this.currentBrandId) {
          return this.newBrand.name && this.newBrand.name.length
        }
        for (let name of ['cn_name', 'hk_name', 'en_name']) {
          if (!this.newBrand[name] || !this.newBrand[name].length) {
            return false;
          }
        }
        return true;
      },
      updateSort() {
        const sortedList = this.currentBrandId ? this.formalModels : this.formalBrands;
        const result = sortedList.map((item, index) => {
          return {
            category_id: item.id,
            sort_id: index
          }
        });
        this.$axios.put('/categories', result).then(response => {
          if (this.currentBrandId) {
            this.getUnformalModels(this.currentBrandId)
          } else {
            this.getUnformalBrands(this.kind_id)
          }
        })
      },
      renderCategory(h, {data}) {
        return (<div class="category-item"> {data.cn_name || data.name} </div>)
      },
      checkDrop(draggingNode, dropNode, type) {
        if (type === 'inner') {
          return false
        }
        return true
      },
      selectKind(selected) {
        this.getFormalBrands(selected);
        if (this.isFormal !== 'formal') {
          this.getUnformalBrands(selected);
        }
        this.currentBrandId = null;
        this.targetCategoryId = null;
        this.newBrand = this.getNewBrand(selected);
      },
      selectBrand(selected) {
        this.targetCategoryId = null;
        if (selected) {
          this.getFormalModels(selected);// 两个都需要
          if (this.isFormal !== 'formal') {
            this.getUnformalModels(selected);
          }
          this.newBrand = this.getNewBrand(selected);
        } else {
          this.selectKind(this.kind_id);
        }
      },
      changeTab(tab) {
        if (this.currentBrandId) {
          this.selectBrand(this.currentBrandId);
        } else {
          this.selectKind(this.kind_id);
        }
      }
    }
  }
</script>
<style lang="scss">
    .manage-brands {

        .formal-brands {
            .categories-tree {
                margin-top: 1rem;
                .el-tree {
                    max-height: 300px;
                    overflow-y: auto;
                    .el-tree-node__content {
                        height: 40px;
                    }
                    .category-item{
                        white-space: normal;
                    }
                }
                .submit-sort {
                    width: 100%;
                    margin: 1rem 0;
                }
            }
            .create-brand {
                width: 500px;
                margin: 10px auto;
                .title {
                    text-align: center;
                    font-size: 16px;
                    margin-bottom: 16px;
                }
                .submit-brand {
                    width: 100%;
                }
            }
        }
        .merge-target {
            display: flex;
            padding: 1rem;
            justify-content: flex-start;
            button {
                margin-left: 1rem;
            }
        }
    }
</style>