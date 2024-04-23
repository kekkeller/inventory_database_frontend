<template>
  <div class="chart-container">
    <line-chart :chart-data="salesData" :options="chartOptions"></line-chart>
    <bar-chart :chart-data="usageData" :options="chartOptions"></bar-chart>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Chart, registerables } from 'chart.js';
import {BarChart, LineChart} from 'vue-chart-3';

Chart.register(...registerables);

// Daten für Verkaufszahlen
const salesData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Monthly Sales ($)',
      data: [5000, 6000, 7000, 8000, 7500, 8200],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    }
  ]
});

// Daten für Benutzungsstatistiken
const usageData = ref({
  labels: ['iPhone 12', 'MacBook Pro', 'iPad Pro', 'Samsung S21'],
  datasets: [
    {
      label: 'Device Usage',
      data: [50, 60, 70, 45],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ]
});

// Chart-Optionen
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line and Bar Chart'
    }
  }
};
</script>

<style>
.chart-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
</style>
