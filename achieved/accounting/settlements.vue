<template>
    <div class="main-content accounting">
        <h1>卖家结算管理</h1>
        <el-tabs class="with-margin-top">
            <el-tab-pane label="待结算流水">
                <el-table
                        class="with-margin-top accounting-table"
                        :data="toPay"
                        style="width: 100%">
                    <el-table-column v-for="(column, index) in itemColumns"
                                     v-if="column.link && !column.hidden"
                                     :key="index"
                                     :prop="column.prop"
                                     :label="column.label"
                                     :formatter="column.formatter"
                                     :class-name="column.className"
                                     :sortable="column.sortable"
                                     :sort-method="column.sortMethod"
                                     :min-width="column.width">
                        <template slot-scope="scope">
                            <router-link
                                    :to="column.link+'/'+(column.text?scope.row[column.prop]['id']:scope.row['id'])">
                                {{column.text?scope.row[column.prop][column.text]:scope.row[column.prop]}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="!column.hidden"
                                     :key="index"
                                     :prop="column.prop"
                                     :label="column.label"
                                     :formatter="column.formatter"
                                     :sortable="column.sortable"
                                     :class-name="column.className"
                                     :sort-method="column.sortMethod"
                                     :min-width="column.width">
                    </el-table-column>
                </el-table>
                <div class="accounting-actions with-margin-top">
                    <el-button type="primary" @click="downloadToPay">
                        <i class="iconfont icon-download"></i>下载 待结算清单
                    </el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已结算记录">
                <el-table class="with-margin-top" :data="resources">
                    <el-table-column
                            key="id"
                            prop="id"
                            label="ID"
                    >
                    </el-table-column>
                    <el-table-column
                            key="create_time"
                            prop="create_time"
                            label="时间"
                            :formatter="(row,col,value)=>formatTime(value)"
                    >
                    </el-table-column>
                    <el-table-column
                            key="operator_id"
                            prop="operator_id"
                            label="操作人ID"
                    >
                    </el-table-column>
                    <el-table-column
                            key="operator_name"
                            prop="operator_name"
                            label="操作人"
                    >
                    </el-table-column>
                    <el-table-column
                            key="file_name"
                            prop="file_name"
                            label="付款结果文件"
                    >
                        <template slot-scope="scope">
                            <a :href="scope.row.file_url">
                                <el-button class="view-seller">
                                    {{scope.row.file_name}}
                                </el-button>
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="accounting-actions with-margin-top">
                    <el-upload
                            class="upload-csv"
                            action="/api/admin/user/finance"
                            accept=".csv"
                            :show-file-list="false"
                            :with-credentials="true"
                            :file-list="fileList"
                            :data="uploadData"
                            :on-success="uploadSuccess">
                        <el-button type="warning"><i class="iconfont icon-upload"></i>导入 付款结果</el-button>
                    </el-upload>
                </div>
            </el-tab-pane>

        </el-tabs>
    </div>
</template>
<script>
  import {exportCSVFile, timeToDateString} from "../../common/utilities";
  import {settlementHeaders} from "../../common/constants";

  export default {
    data() {
      return {
        itemColumns: [{
          prop: 'id',
          label: '结算ID',
          width: 50,
        }, {
          prop: 'user_id',
          label: '用户ID',
          width: 50,
        }, {
          prop: 'username',
          label: '用户',
          width: 80,
        }, {
          prop: 'payee_username',
          label: '收款人姓名',
          width: 80,
        }, {
          prop: 'payee_bank_name',
          label: '收款银行',
          width: 80,
        }, {
          prop: 'payee_bank_card_no',
          label: '收款银行卡号',
          width: 140,
        }, {
          prop: 'coin_amount',
          label: '应付金额',
          width: 80,
        }, {
          prop: 'coin_type',
          label: '货币类型',
          width: 80,
        }],
        fileList: [],
        toPay: [],
        uploadData: {
          file_type: 'seller_settlement',
        }
      }
    },
    methods: {
      downloadToPay() {
        exportCSVFile(settlementHeaders, this.toPay, '待结算清单' + timeToDateString(new Date()))
      },
      uploadSuccess(response, file, fileList) {
        if (response.code === 0) {
          this.$message({message: file.name + ' 上传成功', type: 'success'})
        } else {
          this.$message({message: response.message + ' 错误代码：' + response.code, type: 'error'})
        }
        this.loadData();
        this.getFilteredResources();
      },
      loadData() {
        this.$axios.get('user/settlements').then(response => {
          this.toPay = response.data.data;
        });
      }
    },
    mounted() {
      this.initResources('user/finance', null, {file_type: 'seller_settlement'});
      this.loadData();
    }
  }
</script>
<style lang="scss" scoped>
    .accounting {
        .accounting-actions {
            button {
                float: right;
            }
            .upload-csv {
                display: inline-block;
                float: right;
            }
        }
        .accounting-table {
            max-height: 600px;
        }
    }
</style>