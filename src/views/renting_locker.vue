<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Renting Locker</h3>
    <b-table striped hover :items="lockers" :fields="fields" class="w-full">
      <template #cell(actions)="{ item }">
        <b-button
            variant="secondary"
            @click="openModal(item)"
            v-if="!item.isBooked">
          Book this Locker
        </b-button>
      </template>
    </b-table>

    <b-modal
        id="locker-details"
        v-model="isModalVisible"
        title="Locker Details"
        hide-footer
        @hide="closeModal">
      <template v-if="selectedLocker">
        <div v-if="!bookingConfirmed">
          <p><strong>Name:</strong> {{ selectedLocker.Name }}</p>
          <p><strong>Location:</strong> {{ selectedLocker.Location }}</p>
          <b-button variant="success" class="mr-2" @click="confirmBooking">Book Locker</b-button>
          <b-button variant="danger" @click="closeModal">Cancel</b-button>
        </div>
        <div v-else>
          <p>Your booking pin: {{ bookingPin }}</p>
          <b-img :src="mapImageUrl"></b-img>
          <b-button variant="primary" class="mt-2" @click="closeModal">Okay</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

interface Locker {
  Name: string;
  Location: string;
  isBooked: boolean;
}

export default defineComponent({
  setup() {
    const mapImageUrl = new URL('../assets/map.JPG', import.meta.url).href;
    const lockers = ref<Locker[]>([
      {
        Name: 'Locker 1',
        Location: 'Schöfferstraße 3, 64295 Darmstadt, Deutschland',
        isBooked: false,
      },
      {
        Name: 'Locker 2',
        Location: 'Talonpojankatu 2, 67100 Kokkola',
        isBooked: false,
      },
      {
        Name: 'Locker 3',
        Location: 'Schöfferstraße 3, 64295 Darmstadt, Deutschland',
        isBooked: false,
      }
    ]);

    const fields = [
      { key: 'Name', label: 'Name' },
      { key: 'Location', label: 'Location' },
      { key: 'actions', label: '', sortable: false }
    ];

    const isModalVisible = ref(false);
    const selectedLocker = ref<Locker | null>(null);
    const bookingConfirmed = ref(false);
    const bookingPin = ref("");

    function openModal(item: Locker) {
      selectedLocker.value = item;
      isModalVisible.value = true;
      bookingConfirmed.value = false;
    }

    function closeModal() {
      isModalVisible.value = false;
      bookingConfirmed.value = false;
      bookingPin.value = "";
    }

    function confirmBooking() {
      if (selectedLocker.value) {
        selectedLocker.value.isBooked = true;
        bookingConfirmed.value = true;
        bookingPin.value = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a random 4-digit pin
      }
    }

    return {
      lockers,
      fields,
      isModalVisible,
      selectedLocker,
      openModal,
      closeModal,
      confirmBooking,
      bookingConfirmed,
      bookingPin,
      mapImageUrl
    };
  },
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
