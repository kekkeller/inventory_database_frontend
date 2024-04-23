<script lang="ts">
import { defineComponent, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import AdminNavBar from '@/components/AdminNavBar.vue'
import Footer from '@/components/Footer.vue'

export default defineComponent({
  setup() {
    const isAdmin = computed(() => sessionStorage.getItem('isAdmin') === 'true');

    return { isAdmin };
  },
  components: { NavBar, AdminNavBar, Footer },
})
</script>

<template>
  <div id="app">
    <!-- Bedingte Anzeige der NavBars basierend auf der Rolle -->
    <AdminNavBar v-if="isAdmin" />
    <NavBar v-else-if="$route.name !== 'Login'" />
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
