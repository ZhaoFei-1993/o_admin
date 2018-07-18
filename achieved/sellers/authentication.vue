<template>
    <div class="main-content">
        <h1>卖家审核 (共 {{totalNum||0}} 条待审核)</h1>
        <AuthInfo v-if="record" :record="record"/>
        <div v-if="record" class="auth-actions">
            <el-button type="success" @click="passAuth">通过</el-button>
            <el-button type="danger" @click="failAuth">不通过</el-button>
        </div>
        <template v-else>
            <div>暂无新的用户资料需要审核</div>
        </template>
        <el-dialog
                title="审核不通过"
                :visible.sync="authDialogVisible"
                width="30%">
            <el-input :rows="4" type="textarea" placeholder="请填写审核不通过的原因(五个字符以上)" v-model="authComment"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="authDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmFailAuth"
                           :disabled="!authComment||authComment.length<5">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import AuthInfo from '~/components/AuthInfo'

  export default {
    data() {
      return {
        totalNum: 0,
        record: null,
        authComment: null,
        authDialogVisible: false,
      }
    },
    components: {
      AuthInfo
    },
    mounted() {
      this.getRecord();
    },
    methods: {
      getRecord() {
        this.$axios.get('/user/auth').then(response => {
          console.log(response.data.data)
          this.record = response.data.data.data;
          this.totalNum = response.data.data.total;
        });
      },
      passAuth() {
        this.changeAuth(true, '')
      },
      failAuth() {
        this.authComment = null;
        this.authDialogVisible = true;
      },
      confirmFailAuth() {
        this.changeAuth(false, this.authComment);
      },
      changeAuth(isSuccess, comment) {
        this.$axios.patch('/user/auth/' + this.record.user_id, {
          auth_status: isSuccess ? 2 : 3,
          reason: comment
        }).then(response => {
          this.$message({message: '审核结果已提交', type: 'success'})
          this.getRecord();
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
    .auth-actions {
        text-align: center;
        button {
            min-width: 120px;
        }
    }
</style>