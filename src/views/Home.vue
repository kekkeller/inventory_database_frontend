<template>
  <div>
    <h1>Willkommen Philipp</h1>
    <div class="w-full w-75 items-center">
      <div>
        <label v-for="(ticker, index) in selectedStocks" :key="index">
          Stock {{ index + 1 }}:
          <input v-model="selectedStocks[index]" placeholder="Enter Stock Ticker (e.g., AAPL)" />
        </label>
      </div>
      <button @click="fetchStockData">Fetch Data</button>
      <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import ApexCharts from 'vue3-apexcharts';

export default defineComponent({
  components: {
    apexchart: ApexCharts,
  },
  setup() {
    const selectedStocks = ref(['AAPL', '', '', '', '']);

    const series = ref([
      {
        name: '',
        data: [],
      },
    ]);

    const chartOptions = ref({
      chart: {
        type: 'line',
        height: 350,
      },
      title: {
        text: 'Stock Prices Over the Last 3 Months',
      },
      xaxis: {
        categories: [],
      },
    });

    const apiKey = 'qLKH4ya_B_ub1xNT5Xwp_B4NoUPU0Pgi';

    const fetchStockData = async () => {
      try {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = new Date().toISOString().split('T')[0];

        const promises = selectedStocks.value
            .filter((ticker) => ticker !== '')
            .map(async (stockTicker) => {
              const response = await axios.get(
                  `https://api.polygon.io/v2/aggs/ticker/${stockTicker}/range/1/day/${formattedStartDate}/${formattedEndDate}`,
                  {
                    params: {
                      apiKey: apiKey,
                    },
                  }
              );
              return {
                name: stockTicker,
                data: response.data.results.map((entry: any) => entry.c),
                categories: response.data.results.map((entry: any) =>
                    new Date(entry.t).toLocaleDateString()
                ),
              };
            });

        const results = await Promise.all(promises);

        series.value = results.map((result) => ({
          name: result.name,
          data: result.data,
        }));

        if (results.length > 0) {
          chartOptions.value.xaxis.categories = results[0].categories;
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    onMounted(() => {
      fetchStockData();
    });

    return {
      selectedStocks,
      series,
      chartOptions,
      fetchStockData,
    };
  },
});
</script>

<style scoped>
.buttonsize {
  width: 10rem;
}

label {
  display: block;
  margin-bottom: 1rem;
}

input {
  margin-left: 0.5rem;
  padding: 0.25rem;
}
</style>
