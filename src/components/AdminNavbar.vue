<template>
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo und Titel, ähnlich wie in der Hauptnavbar -->
          <div class="flex-shrink-0 flex items-center">
            <a class="text-white text-2xl no-underline">Admin Panel - Database Inventory</a>
          </div>
          <!-- Links speziell für Admins -->
          <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4 pl-5">
            <router-link
                :to="{ name: 'AdminDashboard' }"
                class="no-underline text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="active-tab"
            >Dashboard</router-link>
            <!-- Weitere Admin-spezifische Links können hier eingefügt werden -->
          </div>
        </div>
        <div class="flex items-center">
          <!-- Logout Button rechts ausrichten mit der logout-btn Klasse -->
          <button @click="logout" class="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  // Session-Daten löschen
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('isAdmin');

  // Umleitung zum Login-Screen
  router.push('/login');
};
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
  &:hover {
    background-color: #c30000; /* Dunklerer Rot-Ton beim Hover */
  }
}

.active-tab {
  background-color: #4A5568;
  color: white;
  border-radius: 0.375rem;
}
</style>
