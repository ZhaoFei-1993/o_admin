<!--用户头像组件(首字母型的)-->
<style lang="scss">
  .user-avatar {
    position: relative;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    color: #ffffff;

    .user-online {
      position: absolute;
      right: 2px;
      bottom: 2px;
      height: 12px;
      width: 12px;
      border: 2px solid #fff;
      border-radius: 100%;
      background-color: #52cbca;
    }
    .dot {
      position: absolute;
      height: 8px;
      width: 8px;
      right: 8px;
      top: 8px;
      border-radius: 50%;
      transform: translate3d(100%, -50%, 0);
      background-color: #e35555;
      border: solid 2px #fff;
      display: inline-block;
    }
  }
</style>

<template>
  <div class="user-avatar" :style="{width: `${size}px`, height: `${size}px`, backgroundColor: bgc, fontSize: `${size * 0.5}px`}">
    {{username[0]}}
    <span v-if="online" class="user-online"></span>
    <sup class="dot" v-if="dot" :style="dotStyle"></sup>
  </div>
</template>

<script>
const colorList = ['red', '#52cbca']
export default {
  name: 'user-avatar',
  computed: {
    // 头像背景色，有color用color，有index用index(循环颜色)，都没有就随机
    bgc: function () {
      if (this.color) return this.color

      if (this.index) return colorList[this.index % colorList.length]

      return colorList[Math.floor(Math.random() * colorList.length)]
    }
  },
  props: {
    username: {
      type: String,
      default: ''
    },
    online: Boolean,

    size: {
      type: Number,
      default: 50
    },
    // color/index有一个就够
    color: {
      type: String
    },
    index: Number,
    dot: {
      type: Boolean,
      default: false,
    },
    dotStyle: {
      type: String,
      default: '',
    },
  }
}
</script>
