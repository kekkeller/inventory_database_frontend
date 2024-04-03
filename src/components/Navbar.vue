<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="-ml-2 mr-2 flex items-center md:hidden">
          </div>
          <div class="flex-shrink-0 flex items-center">
<!--            <ArrowDownIcon class="h-6 w-6 text-blue-500" />-->
            <a class="text-white"> Database Inventory </a>
          </div>
          <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
            <router-link
              :to="{ name: 'Home' }"
              class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
              aria-current="page"
              >Home</router-link
            >
            <router-link
                :to="{ name: 'Renting Device' }"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >Rent Device</router-link
            >
            <router-link
                :to="{ name: 'Renting Locker' }"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >Rent Locker</router-link
            >
            <router-link
                :to="{ name: 'Report a Problem' }"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >Report a Problem</router-link
            >

          </div>
        </div>
        <div class="flex items-center">
          <div class="flex-shrink-0">

          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// import { useWalletStore } from '../stores/wallet'
import WalletConnect from './WalletConnect.vue'
import {ArrowDownIcon} from "@heroicons/vue/24/solid";

export default defineComponent({
  components: {ArrowDownIcon, WalletConnect },

})
</script>
