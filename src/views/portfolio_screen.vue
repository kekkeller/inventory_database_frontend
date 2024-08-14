<template>
  <div class="flex flex-col h-full">
    <header class="bg-background border-b px-6 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Stock Dashboard</h1>
      <div class="flex items-center gap-4">
        <input
            v-model="newPortfolio.name"
            placeholder="Create new portfolio"
            class="input max-w-xs"
        />
        <button @click="handleAddPortfolio" class="button">
          Add Portfolio
        </button>
      </div>
    </header>
    <main class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div class="bg-background rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-bold mb-4">Favorites</h2>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="stock in favorites" :key="stock.symbol" class="card p-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-lg font-bold">{{ stock.symbol }}</div>
                <div class="text-muted-foreground">${{ stock.price.toFixed(2) }}</div>
              </div>
              <button
                  @click="handleRemoveFromFavorites(stock)"
                  class="button ghost icon"
              >
                <XIcon class="w-5 h-5" />
              </button>
            </div>
            <div class="mt-4 flex justify-end">
              <b-button
                @click="handleAddToPortfolio(stock)"
                class="button outline sm">
                Add to Portfolio
              </b-button>
            </div>
          </div>
        </div>
      </div>
      <div
          v-for="portfolio in portfolios"
          :key="portfolio.name"
          class="bg-background rounded-lg shadow-lg p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">{{ portfolio.name }}</h2>
          <button
              @click="handleRemovePortfolio(portfolio)"
              class="button ghost icon"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div
              v-for="stock in portfolio.stocks"
              :key="stock.symbol"
              class="card p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="text-lg font-bold">{{ stock.symbol }}</div>
                <div class="text-muted-foreground">${{ stock.price.toFixed(2) }}</div>
              </div>
              <button
                  @click="handleRemoveFromPortfolio(portfolio, stock)"
                  class="button ghost icon"
              >
                <XIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <ApexChart
              type="line"
              :options="chartOptions"
              :series="getSeries(portfolio)"
              class="aspect-[9/4]"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from "vue";
import ApexChart from "vue3-apexcharts";
const XIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `,
};

export default {
  components: {
    ApexChart,
    XIcon,
  },
  setup() {
    const portfolios = ref([
      {
        name: "Tech Portfolio",
        stocks: [
          { symbol: "AAPL", price: 120.45 },
          { symbol: "MSFT", price: 250.12 },
          { symbol: "AMZN", price: 3120.78 },
        ],
      },
      {
        name: "Growth Portfolio",
        stocks: [
          { symbol: "NVDA", price: 560.23 },
          { symbol: "TSLA", price: 650.45 },
          { symbol: "SHOP", price: 1120.12 },
        ],
      },
      {
        name: "Dividend Portfolio",
        stocks: [
          {symbol: "JNJ", price: 165.78},
          {symbol: "PG", price: 132.45},
          {symbol: "KO", price: 54.12},
        ],
      },
    ]);

    const favorites = ref([
      {symbol: "AAPL", price: 120.45},
      {symbol: "MSFT", price: 250.12},
      {symbol: "AMZN", price: 3120.78},
      {symbol: "NVDA", price: 560.23},
    ]);

    const newPortfolio = ref({
      name: "",
      stocks: [],
    });

    const chartOptions = ref({
      chart: {
        type: 'line',
        height: 350,
      },
      xaxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June'],
      },
      stroke: {
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        x: {
          format: 'MM',
        },
      },
    });

    const handleAddPortfolio = () => {
      if (newPortfolio.value.name.trim() !== "") {
        portfolios.value.push({...newPortfolio.value});
        newPortfolio.value.name = "";
        newPortfolio.value.stocks = [];
      }
    };

    const handleAddToPortfolio = (stock) => {
      const portfolio = portfolios.value.find(
          (p) => p.name === newPortfolio.value.name
      );
      if (portfolio) {
        portfolio.stocks.push(stock);
      }
    };

    const handleRemoveFromPortfolio = (portfolio, stock) => {
      const updatedPortfolio = {
        ...portfolio,
        stocks: portfolio.stocks.filter((s) => s.symbol !== stock.symbol),
      };
      portfolios.value = portfolios.value.map((p) =>
          p.name === portfolio.name ? updatedPortfolio : p
      );
    };

    const handleRemovePortfolio = (portfolio) => {
      portfolios.value = portfolios.value.filter(
          (p) => p.name !== portfolio.name
      );
    };

    const handleAddToFavorites = (stock) => {
      if (!favorites.value.some((f) => f.symbol === stock.symbol)) {
        favorites.value.push(stock);
      }
    };

    const handleRemoveFromFavorites = (stock) => {
      favorites.value = favorites.value.filter(
          (f) => f.symbol !== stock.symbol
      );
    };

    const getSeries = (portfolio) => {
      return [
        {
          name: portfolio.name,
          data: portfolio.stocks.map((stock) => stock.price),
        },
      ];
    };

    return {
      portfolios,
      favorites,
      newPortfolio,
      chartOptions,
      getSeries,
      handleAddPortfolio,
      handleAddToPortfolio,
      handleRemoveFromPortfolio,
      handleRemovePortfolio,
      handleAddToFavorites,
      handleRemoveFromFavorites,
    };
  },
};

</script>

<style>
/* Add your styles here */
</style>
