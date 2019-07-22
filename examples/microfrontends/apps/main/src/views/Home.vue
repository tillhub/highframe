<template>
  <div class="home">
    <hello-world msg="Welcome to the Microfrontend World" />

    <div
      class="target"
      ref="target"
    />
  </div>
</template>

<script>
import Highframe from 'highframe'
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  data () {
    return {
      highframe: null
    }
  },
  components: {
    HelloWorld
  },
  mounted () {
    this.highframe = Highframe.create(this.$refs.target, { src: 'http://localhost:8081', childOrigin: 'http://localhost:8081' })

    this.highframe.on('ready', () => {
      console.log('==============================')
      console.log('ready')
      console.log('==============================')
    })

    this.highframe.on('loaded', () => {
      console.log('==============================')
      console.log('loaded')
      console.log('==============================')
    })
  }
}
</script>

<style scoped>
.target {
  height: 50vh;
  width: 50vh;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid coral;
  border-radius: 5px;
}
</style>
