<template>
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <img :src="logoImageUrl" alt="Icon" class="h-10 w-auto">
            <a class="text-white text-2xl no-underline">Database Inventory</a>
          </div>
          <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4 pl-5">
            <router-link
                :to="{ name: 'Home' }"
                class="no-underline text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                aria-current="page"
                active-class="active-tab"
            >Home</router-link>
            <router-link
                :to="{ name: 'Renting Device' }"
                class="no-underline text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="active-tab"
            >Rent Device</router-link>
            <router-link
                :to="{ name: 'Renting Locker' }"
                class="no-underline text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="active-tab"
            >Rent Locker</router-link>
            <router-link
                :to="{ name: 'Report a Problem' }"
                class="no-underline text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="active-tab"
            >Report a Problem</router-link>
          </div>
        </div>
        <div class="flex items-center">
          <!-- Logout Button -->
          <button @click="logout" class="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import {useLoggedIn} from "@/composable/useLoggedIn";

export default defineComponent({
  setup() {
    const router = useRouter();
    const {setLoggedIn} = useLoggedIn();
    const logoImageUrl = new URL('../assets/logo.png', import.meta.url).href;

    function logout() {
      // Session-Daten löschen
      setLoggedIn('None');
      // Umleitung zum Login-Screen
      router.push('/login');
    }

    return { logout, logoImageUrl };
  }
});
</script>

<style scoped>
.logout-btn {
  margin-left: 20px; /* Abstand von anderen Elementen */
  background-color: #f00; /* Rote Farbe für den Logout-Button */
  color: white; /* Weiße Textfarbe */
  padding: 8px 16px; /* Padding hinzufügen für besseres Aussehen */
  border-radius: 0.375rem; /* Rundungen hinzufügen */
  cursor: pointer; /* Cursor als Zeiger, um die Interaktivität anzuzeigen */
  transition: background-color 0.3s; /* Glatter Übergang für Hover-Effekt */
}
</style>
