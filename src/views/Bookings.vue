<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">All Bookings</h3>
    <b-table striped hover :items="rentals" :fields="fields" class="w-full">
      <template #cell(actions)="{ item }">
        <b-button v-b-modal="'modal-1'" @click="handleClick(item)">Details</b-button>
        <b-button variant="danger" @click="showDeleteModal(item)">Delete</b-button>
      </template>
    </b-table>

    <!-- Modal for viewing booking details -->
    <b-modal id="modal-1" title="Rental Details" v-model="modalShow" ok-only ok-variant="secondary" ok-title="Close">
      <div class="modal-content" v-if="selectedItem">
        <div class="ml-4 mt-2">
          <p><strong>Date:</strong> {{ selectedItem.Date }}</p>
          <p><strong>Device:</strong> {{ selectedItem.Device }}</p>
          <p><strong>Active:</strong> {{ selectedItem.Active ? 'Yes' : 'No' }}</p>
          <p><strong>Start Time:</strong> {{ selectedItem.StartTime }}</p>
          <p><strong>End Time:</strong> {{ selectedItem.EndTime }}</p>
          <p><strong>Price:</strong> {{ selectedItem.Price }}</p>
        </div>
      </div>
    </b-modal>

    <!-- Confirmation Modal for deleting bookings -->
    <b-modal id="delete-modal" v-model="isDeleteModalVisible" title="Confirm Delete" @ok="deleteBooking" ok-title="Yes" ok-variant="danger">
      Are you sure you want to delete this booking?
    </b-modal>
  </div>
  <footer_component></footer_component>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BaseLabel } from "@apiida/vue-components";
import Footer_component from "@/components/footer_component.vue";

interface Rental {
  id: number; // Hinzugefügt, um das Löschen zu erleichtern
  Date: string;
  Device: string;
  Active: boolean;
  StartTime: string;
  EndTime: string;
  Price: string;
}

export default defineComponent({
  components: { BaseLabel, Footer_component },
  setup() {
    const rentals = ref<Rental[]>([
      { id: 1, Date: '2024-04-03', Device: 'iPhone 12', Active: true, StartTime: '10:00 AM', EndTime: '04:00 PM', Price: '$19.99' },
      { id: 2, Date: '2024-04-04', Device: 'MacBook Pro 16"', Active: true, StartTime: '09:00 AM', EndTime: '05:00 PM', Price: '$29.99' },
      { id: 3, Date: '2024-04-05', Device: 'iPhone 13 Pro', Active: false, StartTime: '11:00 AM', EndTime: '03:00 PM', Price: '$21.99' },
      { id: 4, Date: '2024-04-06', Device: 'iPad Pro', Active: true, StartTime: '08:00 AM', EndTime: '02:00 PM', Price: '$15.99' },
      { id: 5, Date: '2024-04-07', Device: 'Samsung Galaxy S21', Active: false, StartTime: '12:00 PM', EndTime: '06:00 PM', Price: '$17.99' }
    ]);

    const fields = [
      { key: 'Date', label: 'Date' },
      { key: 'Device', label: 'Device' },
      { key: 'Active', label: 'Active', formatter: value => value ? 'Yes' : 'No' },
      { key: 'StartTime', label: 'Start Time' },
      { key: 'EndTime', label: 'End Time' },
      { key: 'Price', label: 'Price' },
      { key: 'actions', label: '', sortable: false }
    ];

    const modalShow = ref(false);
    const isDeleteModalVisible = ref(false);
    const selectedItem = ref<Rental | null>(null);
    const deletingItemId = ref<number | null>(null);
    const totalPrice = ref<string>('');

    const handleClick = (item: Rental) => {
      modalShow.value = true;
      selectedItem.value = item;
    };

    const showDeleteModal = (item: Rental) => {
      deletingItemId.value = item.id;
      isDeleteModalVisible.value = true;
    };

    const deleteBooking = () => {
      if (deletingItemId.value !== null) {
        rentals.value = rentals.value.filter(r => r.id !== deletingItemId.value);
        isDeleteModalVisible.value = false;
      }
    };


    return {
      rentals,
      fields,
      totalPrice,
      selectedItem,
      handleClick,
      showDeleteModal,
      deleteBooking,
      modalShow,
      isDeleteModalVisible
    };
  },
})
</script>

<style scoped>
.modal-content {
  max-width: 500px;
}
</style>
