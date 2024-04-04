<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Renting Locker</h3>
    <h1 class="text-2xl mb-8"></h1>
    <b-table striped hover :items="lockers" class="w-full"></b-table>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import {BaseLabel, BaseTable } from "@apiida/vue-components";

interface locker {
  Name: string;
  Location: string;
}
export default defineComponent({
  components: {
    BaseTable,
    BaseLabel,
  },
  setup() {
    const lockers: locker[] = [
      {
        Name: 'Locker 1',
        Location: 'Schöfferstraße 3, 64295 Darmstadt, Deutschland',
      },
      {
        Name: 'Locker 2',
        Location: 'Talonpojankatu 2, 67100 Kokkola',
      },
      {
        Name: 'Locker 3',
        Location: 'Schöfferstraße 3, 64295 Darmstadt, Deutschland',
      }
    ];

    return {
      lockers,
    }
  },
})
</script>
