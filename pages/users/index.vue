<template>
    <div class="admin-iframe-container">
        <iframe class="admin-iframe" id="user-iframe" height="100%" width="100%"
                :src="poolUsersList"></iframe>
        <p class="comment">*此页为矿池用户管理页面，如果跳出到别的管理可以通过左侧导航回到其他管理页面</p>
    </div>
</template>
<script>
  import {poolUsersList} from "../../common/constants";

  export default {
    data() {
      return {
        poolUsersList: poolUsersList,
      }
    }
  }
</script>