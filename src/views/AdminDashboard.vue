<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Admin Dashboard</h3>
    <dashboard-charts></dashboard-charts>
    <div class="flex justify mt-4">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DashboardCharts from '@/components/DashboardCharts.vue';

export default defineComponent({
  components: {
    DashboardCharts,
  },
  setup() {

    return {
    }
  },
})
</script>
