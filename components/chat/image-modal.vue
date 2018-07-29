<template>
  <div class="chat-modal" :value="value" v-show="visible" @click="onClose">
    <img :class="['chat-modal-content', closing ? 'chat-modal-out' : '']" :src="src">
  </div>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        closing: false,
      }
    },
    watch: {
      value(val) {
        this.visible = val
      },
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      src: {
        type: String,
        default: '',
      },
    },
    methods: {
      onClose() {
        this.closing = true
        setTimeout(() => {
          this.closing = false
          this.visible = false
          this.$emit('input', this.visible)
        }, 400)
      },
    },
  }
</script>

<style lang="scss">
  .chat-modal {
    position: fixed;
    z-index: 2147483647;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, .8);
    .chat-modal-content {
      margin: auto;
      display: block;
      width: auto;
      max-width: 80%;
      height: auto;
      animation-name: zoom;
      animation-duration: 0.6s;
    }
    .chat-modal-out {
      animation-name: zoom-out;
      animation-duration: 0.6s;
    }

    @keyframes zoom {
      from {transform:scale(1)}
      to {transform:scale(2)}
    }

    @keyframes zoom {
      from {transform:scale(0.4)}
      to {transform:scale(1)}
    }

    @keyframes zoom-out {
      from {transform:scale(1)}
      to {transform:scale(0)}
    }
  }
</style>