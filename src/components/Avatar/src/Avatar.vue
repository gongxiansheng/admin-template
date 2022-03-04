<template>
  <el-avatar
    class="avatar"
    :fit="fit"
    :src="imageSrc"
    :style="calcStyle"
    v-bind="$attrs"
  >
    <span
      class="image-placeholder"
      :style="{ fontSize: fontSize, backgroundColor: background }"
    >{{
      (userName || "Unknown").slice(0, sliceNumber).toUpperCase()
    }}</span>
  </el-avatar>
</template>

<script>
export default {
    name: 'Avatar',

    inheritAttrs: false,
    props: {
        fit: {
            type: String,
            default: 'cover'
        },
        userName: {
            type: String,
            default: 'Unknown'
        },
        src: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: ''
        },
        sliceNumber: {
            type: Number,
            default: 4
        },
        fontSize: {
            type: String,
            default: '12px'
        },
        background: {
            type: String,
            default: '#3381d0'
        }
    },
    computed: {
        imageSrc() {
            if (!this.src) {
                return ''
            }
            if (this.src.startsWith('http')) {
                return this.src
            }
            return 'data:image/jpeg;base64,' + this.src
        },
        calcStyle() {
            if (!this.size) {
                return {}
            }

            return {
                width: this.size,
                height: this.size
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.avatar {
  width: 100%;
  height: 100%;

  .image-placeholder {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: bolder;
    font-size: 16px;
  }
}
</style>
