<template>
  <div class="chart-container">
    <!-- Bar Chart für Gerätebuchungen -->
    <bar-chart :chart-data="bookingData" :options="bookingOptions"></bar-chart>

    <!-- Line Chart für Verkaufszahlen -->
    <line-chart :chart-data="revenueData" :options="revenueOptions"></line-chart>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { BarChart, LineChart } from 'vue-chart-3';
import axios from 'axios';

Chart.register(...registerables);

// Daten für Buchungen der Geräte
const bookingData = ref({
  labels: [],
  datasets: []
});

// Daten für Umsatz
const revenueData = ref({
  labels: [],
  datasets: []
});

// Optionen für das Buchungs-Chart
const bookingOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Device Bookings'
    }
  }
};

// Optionen für das Umsatz-Chart
const revenueOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Revenue'
    }
  }
};

// Methode zum Laden der Buchungsdaten
const loadBookingData = async () => {
  try {
    const response = await axios.get('https://f-itplfo6nya-uc.a.run.app/bookings');
    const bookings = response.data;

    // Daten für die Buchungen der Geräte einrichten
    const deviceBookings = {};

    // Durchlaufe die Buchungen und berechne die Gesamtzahl für jedes Gerät
    bookings.forEach(booking => {
      const deviceID = booking.device_id;

      // Gerät für Buchungszeit hinzufügen
      if (!deviceBookings[deviceID]) {
        deviceBookings[deviceID] = 1;
      } else {
        deviceBookings[deviceID]++;
      }
    });

    // Konvertiere die Objekte in Arrays für das Chart-Format
    bookingData.value.labels = Object.keys(deviceBookings);
    bookingData.value.datasets = [
      {
        label: 'Device Bookings',
        data: Object.values(deviceBookings),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ];
  } catch (error) {
    console.error('Failed to load booking data:', error);
  }
};

// Methode zum Laden der Umsatzdaten
const loadRevenueData = async () => {
  try {
    const response = await axios.get('https://f-itplfo6nya-uc.a.run.app/bookings');
    const bookings = response.data;

    // Summiere den Umsatz für jeden Monat
    const revenueByMonth = {};

    bookings.forEach(booking => {
      const month = new Date(booking.time_start).getMonth();
      const revenue = booking.booking_price;

      if (!revenueByMonth[month]) {
        revenueByMonth[month] = revenue;
      } else {
        revenueByMonth[month] += revenue;
      }
    });

    // Konvertiere die Objekte in Arrays für das Chart-Format
    revenueData.value.labels = Object.keys(revenueByMonth).map(month => getMonthName(month));
    revenueData.value.datasets = [
      {
        label: 'Revenue ($)',
        data: Object.values(revenueByMonth),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ];
  } catch (error) {
    console.error('Failed to load revenue data:', error);
  }
};

// Hilfsmethode, um den Monatsnamen basierend auf dem Monatsindex zu erhalten
const getMonthName = (monthIndex) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthIndex];
};

// Daten laden, wenn die Komponente montiert wird
onMounted(() => {
  loadBookingData();
  loadRevenueData();
});
</script>

<style>
.chart-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 400px;
}
</style>
