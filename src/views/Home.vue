<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Renting Device</h3>
    <h1 class="text-2xl mb-8"></h1>
    <b-table striped hover :items="bookings" :fields="fields" class="w-full">
      <template #cell(actions)="{ item }">
        <b-button variant="secondary" @click="showDetails(item)">Details</b-button>
      </template>
      <template #cell(time_start)="data">
        {{ formatDateTime(data.item.time_start) }}
      </template>
      <template #cell(time_end)="data">
        {{ formatDateTime(data.item.time_end) }}
      </template>
    </b-table>

    <b-modal id="details-modal" v-model="isModalVisible" title="Booking Details" ok-only ok-title="Close">
      <template v-if="selectedItem">
        <p><strong>Start Time:</strong> {{ formatDateTime(selectedItem.time_start) }}</p>
        <p><strong>End Time:</strong> {{ formatDateTime(selectedItem.time_end) }}</p>
        <p><strong>Price:</strong> {{ selectedItem.price }}</p>
        <p><strong>Device ID:</strong> {{ selectedItem.device_id }}</p>
        <p><strong>User ID:</strong> {{ selectedItem.user_id }}</p>
        <p><strong>Rent Charge:</strong> {{ selectedItem.rent_charge }}</p>
        <p><strong>PIN:</strong> {{ selectedItem.pin }}</p>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';

interface Booking {
  time_start: string;
  time_end: string;
  active: boolean;
  price: number;
  device_id: number;
  user_id: number;
  rent_charge: string;
  pin: number;
  id: number;
}

export default defineComponent({
  setup() {
    const bookings = ref<Booking[]>([]);
    const isModalVisible = ref(false);
    const selectedItem = ref<Booking | null>(null);
    const userId = Number(sessionStorage.getItem('userId'));

    const fields = [
      { key: 'time_start', label: 'Start Time' },
      { key: 'time_end', label: 'End Time' },
      { key: 'price', label: 'Price' },
      { key: 'device_id', label: 'Device ID' },
      { key: 'user_id', label: 'User ID' },
      { key: 'rent_charge', label: 'Rent Charge' },
      { key: 'pin', label: 'PIN' },
      { key: 'actions', label: 'Actions', sortable: false }
    ];

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`/api/bookings/allbyUserID/${userId}`);
        bookings.value = response.data;
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    const showDetails = (item: Booking) => {
      selectedItem.value = item;
      isModalVisible.value = true;
    };

    const formatDateTime = (dateTime: string) => {
      const date = new Date(dateTime);
      return date.toLocaleString();
    };

    onMounted(() => {
      fetchBookings();
    });

    return {
      bookings,
      fields,
      showDetails,
      isModalVisible,
      selectedItem,
      formatDateTime
    };
  }
});
</script>
