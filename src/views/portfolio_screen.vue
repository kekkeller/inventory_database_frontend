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

    <!-- Grid für Favoriten und Aktien Suche -->
    <main class="flex-1 grid grid-cols-2 gap-6 p-6">
      <!-- Favoriten Section -->
      <div>
        <!-- Favoritenliste -->
        <div class="bg-background rounded-lg shadow-lg p-4">
          <h2 class="text-xl font-bold mb-4">Favorites</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="stock in favorites" :key="stock.symbol" class="card p-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-lg font-bold">{{ stock.symbol }}</div>
                  <div class="text-muted-foreground">${{ stock.price.toFixed(2) }}</div>
                </div>
              </div>
              <div class="mt-2 flex justify-end">
                <b-button
                    @click="openAddToPortfolioModal(stock)"
                    variant="outline-primary"
                >
                  Add to Portfolio
                </b-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal für das Hinzufügen zur Portfolio -->
        <b-modal
            v-model="showModal"
            title="Add Stock to Portfolio"
            @ok="confirmAddToPortfolio"
            ok-title="Add"
        >
          <b-form-group label="Select Portfolio">
            <b-form-select
                v-model="selectedPortfolio"
                :options="portfolios.map(portfolio => portfolio.name)"
                required
            ></b-form-select>
          </b-form-group>
          <b-form-group label="Investment Amount">
            <b-form-input
                v-model.number="investmentAmount"
                type="number"
                min="0"
                placeholder="Enter amount"
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Quantity (optional)">
            <b-form-input
                v-model.number="quantity"
                type="number"
                min="0"
                placeholder="Enter quantity"
            ></b-form-input>
          </b-form-group>
        </b-modal>
      </div>

      <!-- Aktien Suche Section -->
      <div class="bg-background rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-bold mb-4">Aktien Suche</h2>
        <div>
          <b-form-input
              v-model="searchQuery"
              placeholder="Search for stocks..."
              @input="searchStocks"
          />
        </div>
        <div v-if="searchResults.length > 0" class="mt-4">
          <ul>
            <li v-for="result in searchResults" :key="result.symbol" class="mb-2">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-bold">{{ result.symbol }}</div>
                  <div>{{ result.description }}</div>
                </div>
                <b-button
                    @click="handleAddToFavorites(result)"
                    variant="outline-primary"
                >
                  Add to Favorites
                </b-button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Grid für die Portfolios -->
      <main class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div
            v-for="portfolio in portfolios"
            :key="portfolio.name"
            class="bg-background rounded-lg shadow-lg p-6 portfolio-chart"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold">{{ portfolio.name }}</h2>
            <h3 class="text-lg font-black">Value: ${{ getPortfolioValue(portfolio) }}</h3>
            <b-button @click="handleRemovePortfolio(portfolio)" variant="primary" size="sm" class="icon">
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
                  <div class="flex items-center mt-2">
                    <label for="amount" class="mr-2">Amount:</label>
                    <input
                        v-model.number="stock.amount"
                        @input="updateQuantity(stock)"
                        type="number"
                        min="0"
                        class="w-24 text-center"
                        placeholder="Enter amount"
                    />
                  </div>
                  <div class="flex items-center mt-2">
                    <label for="quantity" class="mr-2">Qty:</label>
                    <input
                        v-model.number="stock.quantity"
                        type="number"
                        min="0"
                        class="w-16 text-center"
                        readonly
                    />
                  </div>
                </div>
                <b-button
                    @click="handleRemoveFromPortfolio(portfolio, stock)"
                    variant="danger"
                    size="sm"
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ApexChart from 'vue3-apexcharts';
import { BButton, BFormInput } from 'bootstrap-vue-3';
import axios from 'axios';

export default {
  components: {
    ApexChart,
    BButton,
    BFormInput,
  },
  setup() {
    const API_KEY = 'cqv4us9r01qkoahf7nfgcqv4us9r01qkoahf7ng0';  // Dein API-Schlüssel
    const FINNHUB_API_BASE_URL = 'https://finnhub.io/api/v1';
    const LOCAL_STORAGE_KEY = 'vue-portfolio-data';  // Key für localStorage
    const LOCAL_STORAGE_KEY_FAVORITES = 'vue-favorites-data';

    const socket = ref(null);
    const favorites = ref([]);
    const portfolios = ref([]);

    // Lade Portfolios aus dem localStorage oder setze Standardwerte
    const loadPortfolios = () => {
      const storedPortfolios = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPortfolios) {
        portfolios.value = JSON.parse(storedPortfolios);
      } else {
        portfolios.value = [
          {
            name: 'Tech Portfolio',
            stocks: [
              { symbol: 'AAPL', price: 224.99, quantity: 1, amount: 224.99 },
              { symbol: 'MSFT', price: 420.08, quantity: 1, amount: 420.08 },
              { symbol: 'AMZN', price: 177.68, quantity: 1, amount: 177.68 },
            ],
          },
          {
            name: 'Growth Portfolio',
            stocks: [
              { symbol: 'NVDA', price: 560.23, quantity: 1, amount: 560.23 },
              { symbol: 'TSLA', price: 650.45, quantity: 1, amount: 650.45 },
              { symbol: 'SHOP', price: 1120.12, quantity: 1, amount: 1120.12 },
            ],
          },
          {
            name: 'Dividend Portfolio',
            stocks: [
              { symbol: 'JNJ', price: 165.78, quantity: 1, amount: 165.78 },
              { symbol: 'PG', price: 132.45, quantity: 1, amount: 132.45 },
              { symbol: 'KO', price: 54.12, quantity: 1, amount: 54.12 },
            ],
          },
        ];
      }
    };

    // Speichere Portfolios im localStorage
    const savePortfolios = () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(portfolios.value));
    };


    const showModal = ref(false);
    const selectedStock = ref(null);
    const selectedPortfolio = ref('');
    const investmentAmount = ref(0);
    const quantity = ref(0);

    const openAddToPortfolioModal = (stock) => {
      selectedStock.value = stock;
      showModal.value = true;
    };

    const confirmAddToPortfolio = () => {
      const portfolio = portfolios.value.find(p => p.name === selectedPortfolio.value);
      if (!portfolio) return;

      // Überprüfen, ob die Aktie bereits im Portfolio ist
      if (portfolio.stocks.some(s => s.symbol === selectedStock.value.symbol)) {
        alert('Stock is already in the selected portfolio.');
        return;
      }

      const price = selectedStock.value.price;
      const qty = quantity.value > 0 ? quantity.value : (investmentAmount.value / price).toFixed(4);

      portfolio.stocks.push({
        symbol: selectedStock.value.symbol,
        price,
        quantity: Number(qty),
        amount: Number((qty * price).toFixed(2))
      });

      // Modal schließen und Felder zurücksetzen
      showModal.value = false;
      selectedPortfolio.value = '';
      investmentAmount.value = 0;
      quantity.value = 0;
      savePortfolios();  // Änderungen im localStorage speichern
    };

    const searchQuery = ref('');
    const searchResults = ref([]);


    // Lade Favoriten aus dem localStorage oder setze Standardwerte
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY_FAVORITES);
      if (storedFavorites) {
        favorites.value = JSON.parse(storedFavorites);
      } else {
        favorites.value = [
          { symbol: 'AAPL', price: 224.99 },
          { symbol: 'MSFT', price: 420.08 },
          { symbol: 'AMZN', price: 177.68 },
        ];
      }
    };

    // Speichere Favoriten im localStorage
    const saveFavorites = () => {
      localStorage.setItem(LOCAL_STORAGE_KEY_FAVORITES, JSON.stringify(favorites.value));
    };

    // Funktion zum Suchen nach Aktien
    const searchStocks = async () => {
      if (searchQuery.value.length < 3) {
        searchResults.value = [];
        return;
      }

      try {
        const response = await axios.get(`${FINNHUB_API_BASE_URL}/search`, {
          params: {
            q: searchQuery.value,
            token: API_KEY,
          },
        });

        // Nur das Symbol und die Beschreibung in den Suchergebnissen anzeigen
        searchResults.value = response.data.result.map(item => ({
          symbol: item.symbol,
          description: item.description, // Aktienname hinzufügen
        }));
      } catch (error) {
        console.error('Error searching for stocks:', error);
        searchResults.value = [];
      }
    };

    const handleAddToFavorites = (result) => {
      if (!favorites.value.some(f => f.symbol === result.symbol)) {
        favorites.value.push({ symbol: result.symbol, price: 0 });
        saveFavorites();  // Änderungen im localStorage speichern
      }
    };


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

    const getPortfolioValue = (portfolio) => {
      return portfolio.stocks.reduce((total, stock) => {
        return total + stock.price * stock.quantity;
      }, 0).toFixed(2);
    };

    const updateQuantity = (stock) => {
      if (stock.price > 0) {
        stock.quantity = (stock.amount / stock.price).toFixed(4); // Berechnung der Anteile basierend auf dem eingegebenen Betrag
      } else {
        stock.quantity = 0;
      }
      savePortfolios();  // Speichern der Änderung
    };

    const getSeries = (portfolio) => {
      return portfolio.stocks.map((stock) => ({
        name: stock.symbol,
        data: [
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
        savePortfolios(); // Speichern nach Änderung
        newPortfolio.value.name = '';
        newPortfolio.value.stocks = [];
      }
    };

    const handleAddToPortfolio = (stock) => {
      const portfolio = portfolios.value.find((p) => p.name === newPortfolio.value.name);
      if (portfolio) {
        portfolio.stocks.push(stock);
        savePortfolios(); // Speichern nach Änderung
      }
    };

    const handleRemoveFromPortfolio = (portfolio, stock) => {
      portfolio.stocks = portfolio.stocks.filter((s) => s.symbol !== stock.symbol);
      savePortfolios(); // Speichern nach Änderung
    };

    const handleRemovePortfolio = (portfolio) => {
      portfolios.value = portfolios.value.filter((p) => p.name !== portfolio.name);
      savePortfolios(); // Speichern nach Änderung
    };


    const handleRemoveFromFavorites = (stock) => {
      favorites.value = favorites.value.filter((f) => f.symbol !== stock.symbol);
    };

    // Funktion zum Starten der WebSocket-Verbindung
    const initializeWebSocket = () => {
      socket.value = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

      socket.value.onopen = () => {
        console.log('WebSocket connection opened');
        // Alle Symbole abonnieren, die in den Favoriten und Portfolios vorhanden sind
        [...favorites.value, ...portfolios.value.flatMap(p => p.stocks)].forEach(stock => {
          socket.value.send(JSON.stringify({ type: 'subscribe', symbol: stock.symbol }));
        });
      };

      socket.value.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'trade') {
          const trade = data.data[0];
          updateStockPrice(trade.s, trade.p);
        }
      };

      socket.value.onclose = () => {
        console.log('WebSocket connection closed');
      };

      socket.value.onerror = (error) => {
        console.error('WebSocket error', error);
      };
    };

    const updateStockPrice = (symbol, price) => {
      // Update price in portfolios
      portfolios.value.forEach((portfolio) => {
        const stock = portfolio.stocks.find((s) => s.symbol === symbol);
        if (stock) stock.price = price;
      });

      // Update price in favorites
      const favorite = favorites.value.find((f) => f.symbol === symbol);
      if (favorite) favorite.price = price;
    };

    // Funktion zum Abrufen des aktuellen Preises für ein bestimmtes Symbol
    const fetchLatestPrice = async (symbol) => {
      try {
        const response = await axios.get(`${FINNHUB_API_BASE_URL}/quote`, {
          params: {
            symbol,
            token: API_KEY,
          },
        });
        const price = response.data.c;  // "c" steht für aktuellen Preis
        updateStockPrice(symbol, price);
        savePortfolios();  // Speichern der Änderung
      } catch (error) {
        console.error('Error fetching the latest price:', error);
      }
    };

    // Funktion zum Abrufen aller aktuellen Preise
    const fetchAllLatestPrices = () => {
      // Preise für alle Favoriten abrufen
      favorites.value.forEach(stock => fetchLatestPrice(stock.symbol));
      // Preise für alle Portfolios abrufen
      portfolios.value.flatMap(p => p.stocks).forEach(stock => fetchLatestPrice(stock.symbol));
    };




    // Lade Portfolios aus dem localStorage beim Mounten
    onMounted(() => {
      loadPortfolios();
      loadFavorites();
      initializeWebSocket();
      fetchAllLatestPrices();  // Preise werden beim Laden der Seite abgerufen
    });

    onBeforeUnmount(() => {
      if (socket.value) {
        socket.value.close();
      }
    });

    return {
      portfolios,
      favorites,
      searchQuery,
      searchResults,
      chartOptions,
      getSeries,
      newPortfolio,
      handleAddPortfolio,
      handleAddToPortfolio,
      handleRemoveFromPortfolio,
      handleRemovePortfolio,
      handleAddToFavorites,
      handleRemoveFromFavorites,
      fetchAllLatestPrices,
      searchStocks,
      getPortfolioValue,
      updateQuantity,
      openAddToPortfolioModal,
      confirmAddToPortfolio,
      showModal,
      selectedStock,
      selectedPortfolio,
      investmentAmount,
      quantity,
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
