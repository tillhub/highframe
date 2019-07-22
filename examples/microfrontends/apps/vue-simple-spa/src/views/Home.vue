<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
    >
    <hello-world msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import { HighframeChild } from 'highframe'
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

console.log('==============================')
console.log(HighframeChild)
console.log('==============================')

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
