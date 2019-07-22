<template>
  <div ref="target">
    some
  </div>
</template>

<script>
import highframe from '../../src/highframe'
export default {
  props: {
    src: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      highframe: null
    }
  },
  mounted() {
    this.highframe = highframe.create(this.$refs.target, { src: this.src })
    console.log('==============================')
    console.log(this.highframe)
    console.log('==============================')
    this.highframe.on('loaded', () => {
      console.log('==============================')
      console.log('loaded')
      console.log('==============================')
    })
  }
}
</script>

<style lang="css" scoped>
</style>
