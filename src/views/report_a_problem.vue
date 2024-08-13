<template>
  <div class="text-center pt-12">
    <report-problem/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ArrowDownIcon } from '@heroicons/vue/24/solid'
import ReportProblem from "@/components/report_problem.vue";


export default defineComponent({
  components: {
    ReportProblem,
    ArrowDownIcon },
  setup() {
    const walletStore = ref<boolean>();


    return {
      walletStore,
    }
  },
})
</script>
