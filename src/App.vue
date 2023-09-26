<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <RouterView />
</template>

<style >
#app {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: red;
}
</style>
