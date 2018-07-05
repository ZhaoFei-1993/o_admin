<template>
    <div class="main-content">
        <h1>订单详情 --- {{currentResourceId}}</h1>
        <template v-if="currentResource && currentResource.id">
            <div class="item-control">
                <span class="section-tip">基本信息</span>
                <div>
                    <el-button
                            type="primary"
                            @click="viewSnapshot">查看快照
                    </el-button>
                    <el-button
                            :disabled="currentResource.delay_receive_times>100||currentResource.status!==2"
                            @click="confirmAction(manageOrder.delay.confirm,()=>patchOperation(manageOrder.delay.code))">
                        {{currentResource.delay_receive_times>100?'已延期太多次':'延期收货'}}
                    </el-button>
                    <template v-if="!currentResource.is_freeze">
                        <el-button
                                type="warning"
                                :disabled="currentResource.status<1||currentResource.status>3"
                                @click="acceptAppeal">接受申诉
                        </el-button>
                    </template>
                    <template v-else>
                        <el-button type="warning"
                                   :disabled="currentResource.status<1||currentResource.status>3"
                                   @click="confirmAction(manageOrder.unfreeze.confirm,()=>patchOperation(manageOrder.unfreeze.code))">
                            撤销申诉
                        </el-button>
                        <el-button type="danger"
                                   :disabled="currentResource.status<1||currentResource.status>3"
                                   @click="confirmAction(manageOrder.refund.confirm,()=>patchOperation(manageOrder.refund.code))">
                            付款给买方
                        </el-button>
                        <el-button type="danger"
                                   :disabled="currentResource.status<1||currentResource.status>3"
                                   @click="confirmAction(manageOrder.receive.confirm,()=>patchOperation(manageOrder.receive.code))">
                            付款给卖方
                        </el-button>
                    </template>
                </div>
            </div>
            <div>
                <DetailTable :properties="orderProps" :detailResource="currentResource"></DetailTable>
            </div>
            <div class="item-description">
                <p class="section-tip">买方留言</p>
                <div>{{currentResource.comment}}</div>
            </div>
            <div class="item-description">
                <p class="section-tip">订单状态</p>
                <template v-if="status&&status.length">
                    <el-table class="with-margin-top"
                              :data="status"
                              style="width: 100%">
                        <el-table-column prop="create_time"
                                         label="时间"
                                         :formatter="formatTime"
                                         :sortable="true"/>
                        <el-table-column prop="user"
                                         label="用户">
                            <template slot-scope="scope">
                                <router-link :to="userById+scope.row.user_id+'/'">{{scope.row.user_name}}</router-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="event"
                                         label="状态"
                                         :formatter="formatEvent"
                        />
                    </el-table>
                </template>
                <template v-else>
                    <div>暂无操作记录</div>
                </template>
            </div>
            <div class="item-description">
                <p class="section-tip">申诉处理记录</p>
                <template v-if="appeals&&appeals.length">
                    <el-table class="with-margin-top"
                              :data="appeals"
                              style="width: 100%">
                        <el-table-column prop="create_time"
                                         label="时间"
                                         :formatter="formatTime"
                                         :sortable="true"
                        />
                        <el-table-column prop="event"
                                         label="类型"
                                         :formatter="(row,col,value)=>orderOperationTypes[value]"
                        />
                        <el-table-column prop="comment"
                                         label="原因"
                        />
                    </el-table>
                </template>
            </div>
        </template>
        <template v-else>
            <h4>加载中</h4>
        </template>
        <el-dialog
                title="接受申诉"
                :visible.sync="appealDialogVisible"
                width="30%">
            <el-input :rows="4" type="textarea" placeholder="请填写申诉内容(五个字符以上)" v-model="appealComment"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="appealDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAppeal"
                           :disabled="!appealComment||appealComment.length<5">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import DetailTable from "~/components/DetailTable";
  import {adminUsers, manageOrder, orderOperationTypes, orderProps} from "../../../common/constants";
  import {formatOrder, timeToLocale} from "../../../common/utilities";

  export default {
    components: {
      DetailTable,
    },
    data() {
      return {
        orderProps: orderProps,
        id: this.$route.params.id,
        userById: adminUsers,
        status: [],
        appeals: [],
        appealDialogVisible: false,
        appealComment: '',
        manageOrder: manageOrder,
        orderOperationTypes: orderOperationTypes,
      }
    },
    mounted() {
      this.initData();
    },
    methods: {
      initData() {
        this.initCurrentResource('orders', this.id, () => {
          formatOrder(this.currentResource);
        });
        this.getOperations();
      },
      formatTime(row, col, cellValue) {
        return timeToLocale(cellValue);
      },
      formatEvent(row, col, cellValue) {
        return orderOperationTypes[cellValue];
      },
      patchOperation(op, comment) {
        this.$axios.post(`orders/${this.id}/operations`, {operation: op, comment: comment}).then(response => {
          if (response.data.code === 0) {
            // 理论上后端要返回新的order
            this.initData();
          }
        })
      },
      viewSnapshot() {
        this.$router.push(`/orders/${this.id}/snapshot`);
      },
      acceptAppeal() {
        this.appealDialogVisible = true;
      },
      confirmAppeal() {
        this.$confirm(manageOrder.freeze.confirm)
          .then(_ => {
            this.appealDialogVisible = false;
            this.patchOperation(manageOrder.freeze.code, this.appealComment);
          })
          .catch(_ => {
            this.appealDialogVisible = false;
          });
      },
      getOperations() {
        this.$axios.get(`orders/${this.id}/operations`).then(response => {
          if (response.data.code === 0) {
            this.status = response.data.data.status;
            this.appeals = response.data.data.appeal; // 后端用的是单数
          }
        });
      },
    }
  }
</script>