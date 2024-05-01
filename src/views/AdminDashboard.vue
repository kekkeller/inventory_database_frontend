<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Admin Dashboard</h3>
    <dashboard-charts></dashboard-charts>
    <div class="d-flex justify-content-center align-items-center pt-10">
      <iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2530450/widgets/852176"></iframe>

      <iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2530450/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&title=History+of+Wattage&type=line"></iframe>
    </div>

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
