<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Renting Device</h3>
    <h1 class="text-2xl mb-8"></h1>
    <b-table striped hover :items="bookings" class="w-full"></b-table>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import {BaseLabel, BaseTable } from "@apiida/vue-components";

interface bookings {
  Category: string;
  Device: string;
  Price: string;
  Location: string;
}
export default defineComponent({
  components: {
    BaseTable,
    BaseLabel,
  },
  setup() {
    const bookings: bookings[] = [
      {
        Category: 'phone',
        Device: 'iPhone 12',
        Price: '$19.99',
        Location: 'building hda',
      },
      {
        Category: 'laptop',
        Device: 'MacBook Pro 16"',
        Price: '$29.99',
        Location: 'building centria',
      },
      {
        Category: 'phone',
        Device: 'iPhone 13 Pro',
        Price: '$21.99',
        Location: 'building hda',
      }
    ];

    return {
      bookings,
    }
  },
})
</script>
