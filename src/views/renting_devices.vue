<template>
  <div class="text-center pt-12">
    <h1 class="text-2xl mb-8">Pick Your Device you want to rent</h1>
  </div>
  <MockupTable class="justify-center mr-20 ml-20"></MockupTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ArrowDownIcon } from '@heroicons/vue/24/solid'
import MockupTable from "@/components/first.vue";
import {BaseDialog} from "@apiida/vue-components";


export default defineComponent({
  components: {
    BaseDialog,
    MockupTable,
    ArrowDownIcon },
  setup() {


    return {
    }
  },
})
</script>
