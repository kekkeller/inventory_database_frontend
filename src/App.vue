<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import AdminNavBar from '@/components/AdminNavBar.vue';
import Footer from './components/Footer.vue';
import { useLoggedIn } from "./composable/useLoggedIn";

export default defineComponent({
  setup() {
    const { loggedIn, checkLoggedIn } = useLoggedIn();
    onMounted(() => {
      checkLoggedIn();
    });

    return { loggedIn };
  },
  components: { NavBar, AdminNavBar, Footer },
})
</script>

<template>
  <div id="app">
    <AdminNavBar v-if="loggedIn === 'Admin'" />
    <NavBar v-else-if="loggedIn === 'User'" />
    <router-view/>
  </div>
</template>
