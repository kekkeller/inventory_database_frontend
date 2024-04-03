<template>
  <div class="text-center pt-12">
    <h1 class="text-2xl mb-8">Please Report your Problem</h1>
    <report-problem>

    </report-problem>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ArrowDownIcon } from '@heroicons/vue/24/solid'
import MockupTable from "@/components/first.vue";
import ReportProblem from "@/components/report_problem.vue";


export default defineComponent({
  components: {
    ReportProblem,
    MockupTable,
    ArrowDownIcon },
  setup() {
    const walletStore = ref<boolean>();


    return {
      walletStore,
    }
  },
})
</script>
