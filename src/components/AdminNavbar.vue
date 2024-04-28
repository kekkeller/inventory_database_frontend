<template>
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo und Titel, ähnlich wie in der Hauptnavbar -->
          <div class="flex-shrink-0 flex items-center">
            <a class="text-white text-2xl no-underline">Admin Panel - Database Inventory</a>
          </div>
          <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4 pl-5">
            <router-link
                :to="{ name: 'AdminDashboard' }"
                class="no-underline text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="active-tab"
            >Dashboard</router-link>
            <router-link
                :to="{ name: 'Categories' }"
                class="no-underline text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="active-tab"
            >Categories</router-link>
            <router-link
                :to="{ name: 'Devices' }"
                class="no-underline text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="active-tab"
            >Devices</router-link>
            <router-link
                :to="{ name: 'Bookings' }"
                class="no-underline text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="active-tab"
            >Bookings</router-link>
            <router-link
                :to="{ name: 'User' }"
                class="no-underline text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="active-tab"
            >User</router-link>
            <router-link
                :to="{ name: 'Problem Reports' }"
                class="no-underline text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="active-tab"
            >Problem Reports</router-link>
          </div>
        </div>
        <div class="flex items-center">
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

    function logout() {
      // Session-Daten löschen
      setLoggedIn('None');
      // Umleitung zum Login-Screen
      router.push('/login');
    }
    return { logout };
  }
});
</script>

<style scoped>
.logout-btn {
  margin-left: auto; /* Sorgt dafür, dass der Button rechts ausgerichtet ist */
  background-color: #f00; /* Rote Farbe für den Logout-Button */
  color: white; /* Weiße Textfarbe */
  padding: 8px 16px; /* Padding hinzufügen für besseres Aussehen */
  border-radius: 0.375rem; /* Rundungen hinzufügen */
  cursor: pointer; /* Cursor als Zeiger, um die Interaktivität anzuzeigen */
  transition: background-color 0.3s; /* Glatter Übergang für Hover-Effekt */
}

</style>
