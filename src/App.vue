<script lang="ts">
import { defineComponent, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import AdminNavBar from '@/components/AdminNavBar.vue'
import Footer from '@/components/Footer.vue'
import { useLoggedIn } from "./composable/useLoggedIn";


export default defineComponent({
  setup() {
    const isAdmin = computed(() => sessionStorage.getItem('isAdmin') === 'true');

    const {loggedIn} = useLoggedIn();

    return { isAdmin, loggedIn };
  },
  components: { NavBar, AdminNavBar, Footer },
})
</script>

<template>
  <div id="app">
    <AdminNavBar v-if="loggedIn == 'Admin'" />
    <NavBar v-else-if="loggedIn == 'User'" />
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
