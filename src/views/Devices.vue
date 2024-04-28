<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Devices</h3>
    <h1 class="text-2xl mb-8"></h1>
    <b-table striped hover :items="bookings" :fields="fields" class="w-full">
      <template #cell(actions)="{ item }">
        <b-button variant="secondary" @click="showDetails(item)">Edit Device</b-button>
      </template>
    </b-table>

    <b-modal id="details-modal" v-model="isModalVisible" title="Booking Details" ok-only ok-title="Close">
      <template v-if="selectedItem">
        <p><b>Category:</b> {{ selectedItem.Category }}</p>
        <p><b>Device:</b> {{ selectedItem.Device }}</p>
        <p><b>Price:</b> {{ selectedItem.Price }}</p>
        <p><b>Location:</b> {{ selectedItem.Location }}</p>
      </template>
    </b-modal>
  </div>
  <footer_component></footer_component>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios';
import Footer_component from "@/components/footer_component.vue";

interface Booking {
  id: number;
  Category: string;
  Device: string;
  Price: string;
  Location: string;
}

export default defineComponent({
  components: {Footer_component},
  setup() {
    const bookings = ref<Booking[]>([]);
    const isModalVisible = ref(false);
    const selectedItem = ref<Booking | null>(null);

    const fields = [
      { key: 'Category', label: 'Category' },
      { key: 'Device', label: 'Device' },
      { key: 'Price', label: 'Price' },
      { key: 'Location', label: 'Location' },
      { key: 'actions', label: 'Actions', sortable: false }  // Add a column for actions
    ];

    const showDetails = (item: Booking) => {
      selectedItem.value = item;
      isModalVisible.value = true;
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get('https://api-generator.retool.com/1gXbZE/data');
        bookings.value = response.data.map((item: any) => ({
          id: item.id,
          Category: item['Column 1'],
          Device: item['Column 2'],
          Price: item['Column 3'],
          Location: item['Column 4']
        }));
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    onMounted(fetchBookings);

    return {
      bookings,
      fields,
      showDetails,
      isModalVisible,
      selectedItem
    }
  },
})
</script>
