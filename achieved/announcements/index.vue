<template>
    <div class="main-content">
        <h1>公告管理</h1>

        <el-row type="flex" justify="space-between">
            <el-col :md="4" :lg="4">
                <p class="total-resource-num">共 {{totalNum}} 个</p>
            </el-col>
            <el-col :md="4" :lg="2">
                <el-button type="primary" @click="createDialogVisible=true">新建公告</el-button>
            </el-col>
        </el-row>
        <el-table
                class="with-margin-top"
                :data="resources"
                style="width: 100%">
            <el-table-column v-for="(column, index) in announcementColumns"
                             :key="index"
                             :prop="column.prop"
                             :label="column.label"
                             :formatter="column.formatter"
                             :class-name="column.className"
                             :sortable="column.sortable"
                             :sort-method="column.sortMethod"
                             :min-width="column.width">
            </el-table-column>
            <el-table-column key="management"
                             label="操作"
                             class-name="management"
                             min-width="450">
                <template slot-scope="scope">
                    <el-button @click="editAnnouncement(scope.row)" type="warning">编辑</el-button>
                    <el-button @click="toggleAnnouncementPub(scope.row)"
                               :disabled="patchingId===scope.row.id||!publishableAnnouncement(scope.row)"
                               :type="scope.row.status===1?'danger':'primary'">{{scope.row.status===1?'撤回':'发布'}}
                    </el-button>
                    <el-button @click="toggleAnnouncementTop(scope.row)"
                               :disabled="patchingId===scope.row.id||scope.row.status!==1"
                               :type="scope.row.is_top?'danger':'primary'">{{scope.row.is_top?'不置顶':'置顶'}}
                    </el-button>
                    <el-button @click="notifyAnnouncement(scope.row)"
                               :type="(scope.row.status!==1||scope.row.is_noticed)?'':'primary'"
                               :disabled="scope.row.status!==1||scope.row.is_noticed">
                        {{scope.row.is_noticed?'已通知':'通知'}}
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination
                class="with-margin-top"
                background
                layout="prev, pager, next"
                @current-change="changePage"
                :current-page.sync="pageNum"
                :total="totalNum">
        </el-pagination>
        <el-dialog
                title="创建新的公告"
                :visible.sync="createDialogVisible"
                width="50%">
            <p>请填写中文简体的公告标题（必填）</p>
            <el-input clearable v-model="defaultCNTitle" placeholder="在此填写标题"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createDialogVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="!defaultCNTitle||defaultCNTitle.trim().length<=0"
                           @click="createAnnouncement">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import {getItemStatusOfIndex, s2t, timeToLocale} from "../../common/utilities";
  import {coinNames, orderStatus, productTypes, adminUsers} from "../../common/constants";

  export default {
    layout: 'default',
    data() {
      return {
        announcementColumns: [{
          prop: 'id',
          label: 'ID',
          width: 50,
        }, {
          prop: 'title_cn',
          label: '标题',
          width: 400,
        }, {
          prop: 'create_time',
          label: '创建时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
          className: 'time',
        }, {
          prop: 'modify_time',
          label: '修改时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
        }, {
          prop: 'announce_time',
          label: '发布时间',
          width: 96,
          formatter: (row, column, cellValue) => {
            return timeToLocale(cellValue)
          },
          className: 'time',
        }],
        patchingId: null,
        createDialogVisible: false,
        defaultCNTitle: '',
      }
    },
    mounted() {
      this.initResources('announcements');
    },
    methods: {
      createAnnouncement() {
        this.$axios.post(`announcements`, {
          title_cn: this.defaultCNTitle,
          detail_cn: '',
          title_en: '',
          detail_en: '',
          title_hk: s2t(this.defaultCNTitle),
          detail_hk: '',
        }).then(response => {
          if (response.data.code === 0) {
            this.editAnnouncement(response.data.data);
          }
        });
      },
      editAnnouncement(announcement) {
        this.$router.push(`announcements/${announcement.id}`);
      },
      toggleAnnouncementPub(announcement) {
        this.patchingId = announcement.id;
        this.$axios.patch('announcements/' + announcement.id, {operation: announcement.status === 1 ? 'off' : 'on'}).then(response => {
          this.patchingId = null;
          if (response.data.code === 0) {
            announcement.status = announcement.status === 1 ? 2 : 1;
          }
        })
      },
      toggleAnnouncementTop(announcement) {
        this.patchingId = announcement.id;
        this.$axios.patch('announcements/' + announcement.id, {operation: announcement.is_top ? 'down' : 'top'}).then(response => {
          this.patchingId = null;
          if (response.data.code === 0) {
            announcement.is_top = !announcement.is_top;
          }
        })
      },
      notifyAnnouncement(announcement) {
        this.patchingId = announcement.id;
        this.$axios.post('announcements/' + announcement.id + '/notify').then(response => {
          this.patchingId = null;
          if (response.data.code === 0) {
            announcement.is_noticed = true;
          }
        })
      },
      publishableAnnouncement(announcement) {
        for (let item of ['detail_cn', 'title_cn', 'detail_en', 'title_en', 'detail_hk', 'title_hk']) {
          if (!announcement[item] || announcement[item].trim().length <= 0) {
            return false;
          }
        }
        return true;
      },
    }
  }
</script>
<style lang="scss" scoped>
    .management {
        button {
            width: 100px;
        }
    }
</style>
<style lang="scss">
    .time .cell {
        width: 96px;
    }
</style>