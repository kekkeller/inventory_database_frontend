<template>
  <div class="flex flex-col h-full">
    <header class="bg-background border-b px-6 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Stock Dashboard</h1>
      <div class="d-flex align-items-center gap-2">
        <div class="d-flex align-items-center">
          <b-form-input
              id="new-portfolio-input"
              v-model="newPortfolio.name"
              placeholder="Enter portfolio name"
              class="max-w-xs"
          />
          <b-button @click="handleAddPortfolio" variant="primary" class="ml-2">
            Add Portfolio
          </b-button>
        </div>
      </div>
    </header>
    <main class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <!-- Favorites Section -->
      <div class="bg-background rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-bold mb-4">Favorites</h2>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="stock in favorites" :key="stock.symbol" class="card p-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-lg font-bold">{{ stock.symbol }}</div>
                <div class="text-muted-foreground">${{ stock.price.toFixed(2) }}</div>
              </div>
            </div>
            <div class="mt-4 flex justify-end">
              <b-button
                  @click="handleAddToPortfolio(stock)"
                  variant="outline-primary"
              >
                Add to Portfolio
              </b-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Portfolios Section -->
      <div
          v-for="portfolio in portfolios"
          :key="portfolio.name"
          class="bg-background rounded-lg shadow-lg p-6 portfolio-chart"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">{{ portfolio.name }}</h2>
          <b-button @click="handleRemovePortfolio(portfolio)" variant="ghost" class="icon">
            <BIconXCircle></BIconXCircle>
          </b-button>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
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
              <b-button
                  @click="handleRemoveFromPortfolio(portfolio, stock)"
                  variant="danger"
                  class="icon"
              >
                <BIconDashCircle></BIconDashCircle>
              </b-button>
            </div>
          </div>
        </div>
        <div class="chart-container">
          <ApexChart
              type="line"
              :options="chartOptions"
              :series="getSeries(portfolio)"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';
import ApexChart from 'vue3-apexcharts';
import { BButton, BFormInput } from 'bootstrap-vue-3';

export default {
  components: {
    ApexChart,
    BButton,
    BFormInput,
  },
  setup() {
    const portfolios = ref([
      {
        name: 'Tech Portfolio',
        stocks: [
          { symbol: 'AAPL', price: 224.99 },
          { symbol: 'MSFT', price: 420.08 },
          { symbol: 'AMZN', price: 177.68 },
        ],
      },
      {
        name: 'Growth Portfolio',
        stocks: [
          { symbol: 'NVDA', price: 560.23 },
          { symbol: 'TSLA', price: 650.45 },
          { symbol: 'SHOP', price: 1120.12 },
        ],
      },
      {
        name: 'Dividend Portfolio',
        stocks: [
          { symbol: 'JNJ', price: 165.78 },
          { symbol: 'PG', price: 132.45 },
          { symbol: 'KO', price: 54.12 },
        ],
      },
    ]);

    const favorites = ref([
      { symbol: 'AAPL', price: 224.99 },
      { symbol: 'MSFT', price: 420.08 },
      { symbol: 'AMZN', price: 177.68 },
      { symbol: 'NVDA', price: 560.23 },
    ]);

    const chartOptions = ref({
      chart: {
        type: 'line',
        height: '100%', // Chart füllt die gesamte Höhe der Kachel aus
        toolbar: {
          show: false, // Toolbar entfernen, um Platz zu sparen
        },
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        labels: {
          formatter: (value) => value.toFixed(2), // Auf 2 Dezimalstellen runden
        },
      },
      markers: {
        size: 4, // Größe der Punkte auf dem Chart
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: (value) => `$${value.toFixed(2)}`, // Tooltip mit 2 Dezimalstellen
        },
      },
    });

    const getSeries = (portfolio) => {
      return portfolio.stocks.map((stock) => ({
        name: stock.symbol,
        data: [
          // Beispiel-Daten: Ersetzen durch echte Daten
          { x: new Date().setDate(new Date().getDate() - 7), y: stock.price },
          { x: new Date().setDate(new Date().getDate() - 3), y: stock.price + 20 },
          { x: new Date(), y: stock.price + 10 },
        ],
      }));
    };

    const newPortfolio = ref({
      name: '',
      stocks: [],
    });

    const handleAddPortfolio = () => {
      if (newPortfolio.value.name.trim() !== '') {
        portfolios.value.push({ ...newPortfolio.value });
        newPortfolio.value.name = '';
        newPortfolio.value.stocks = [];
      }
    };

    const handleAddToPortfolio = (stock) => {
      const portfolio = portfolios.value.find((p) => p.name === newPortfolio.value.name);
      if (portfolio) {
        portfolio.stocks.push(stock);
      }
    };

    const handleRemoveFromPortfolio = (portfolio, stock) => {
      portfolio.stocks = portfolio.stocks.filter((s) => s.symbol !== stock.symbol);
    };

    const handleRemovePortfolio = (portfolio) => {
      portfolios.value = portfolios.value.filter((p) => p.name !== portfolio.name);
    };

    const handleAddToFavorites = (stock) => {
      if (!favorites.value.some((f) => f.symbol === stock.symbol)) {
        favorites.value.push(stock);
      }
    };

    const handleRemoveFromFavorites = (stock) => {
      favorites.value = favorites.value.filter((f) => f.symbol !== stock.symbol);
    };

    return {
      portfolios,
      favorites,
      chartOptions,
      getSeries,
      newPortfolio,
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

<style scoped>
.portfolio-chart {
  height: 100%; /* Kachel füllt den gesamten verfügbaren Platz aus */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Inhalte gleichmäßig verteilen */
}

.chart-container {
  height: 100%; /* Chart füllt die gesamte Kachel aus */
  margin-top: auto; /* Chart bleibt unten in der Kachel */
}

.card {
  height: 100%; /* Sicherstellen, dass die Karten gleichmäßig verteilt sind */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
