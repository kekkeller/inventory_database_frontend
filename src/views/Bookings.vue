<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">All Bookings</h3>
    <b-table striped hover :items="rentals" :fields="fields" class="w-full">
    </b-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

interface Rental {
  id: number;
  time_start: string;
  time_end: string;
  active: boolean;
  booking_price: number;
  device_id: number;
  user_id: number;
  rent_charge: string;
}

export default defineComponent({
  components: { },
  setup() {
    const rentals = ref<Rental[]>([]);
    const fields = [
      { key: 'time_start', label: 'Start Time', formatter: (value) => new Date(value).toLocaleString() },
      { key: 'time_end', label: 'End Time', formatter: (value) => new Date(value).toLocaleString() },
      { key: 'active', label: 'Active', formatter: (value) => value ? 'Yes' : 'No' },
      { key: 'booking_price', label: 'Price' },
      { key: 'device_id', label: 'Device ID' },
      { key: 'user_id', label: 'User ID' },
      { key: 'rent_charge', label: 'Rent Charge' }
    ];

    const loadBookings = async () => {
      try {
        const response = await axios.get('/api/bookings');
        rentals.value = response.data;
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    onMounted(loadBookings);

    return {
      rentals,
      fields,
    };
  },
});
</script>
