<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'

export default defineComponent({
  setup() {
    return {}
  },
  components: { NavBar, Footer },
})
</script>

<template>
  <div id="app">
    <!-- Conditionally render navbar if not on login page -->
    <NavBar v-if="$route.name !== 'Login'" />
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
