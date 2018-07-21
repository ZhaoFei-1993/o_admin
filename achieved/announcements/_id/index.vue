<template>
    <div class="main-content">
        <div class="header-container">
            <h1>公告详情 --- {{currentResourceId||' 加载中'}}</h1>
            <el-button type="primary" @click="saveAnnouncement">保存公告</el-button>
        </div>
        <template v-if="currentResource">
            <AnnouncementEditor :announcement="currentResource"></AnnouncementEditor>
            <div class="actions-container with-margin-top">
                <el-button type="primary" @click="saveAnnouncement">保存公告</el-button>
                <el-button type="primary" @click="saveAnnouncement(true)">保存并退出</el-button>
                <el-button type="danger" @click="exit">放弃编辑</el-button>
            </div>
        </template>
        <template v-else>
            <p>加载中</p>
        </template>
    </div>
</template>
<script>
  import AnnouncementEditor from "~/components/AnnouncementEditor";
  import {pickProps} from "~/common/utilities";

  export default {
    components: {
      AnnouncementEditor,
    },
    mounted() {
      this.initCurrentResource('announcements', this.$route.params.id);
    },
    methods: {
      saveAnnouncement(shouldLeave) {
        const updated = pickProps(['detail_cn', 'title_cn', 'detail_en', 'title_en', 'detail_hk', 'title_hk'], this.currentResource);
        this.$axios.put(
          `announcements/${this.$route.params.id}`,
          updated
        ).then(response => {
          if (response.data.code === 0) {
            if (shouldLeave) {
              this.exit();
            }
          } else {
            this.$message.error('保存公告失败，请另行备份文案并联系攻城狮帮忙debug');
          }
        });
      },
      exit() {
        this.$router.push('/announcements');
      }
    }
  }
</script>
<style lang="scss" scoped>
    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .actions-container{
        display: flex;
        justify-content: flex-end;
    }
</style>
