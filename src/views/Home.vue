<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">My Bookings</h3>
    <b-table striped hover :items="rentals" :fields="fields" class="w-full">
      <template #cell(actions)="{ item }">
        <b-button v-b-modal="'modal-1'" @click="handleClick(item)">Details</b-button>
      </template>
    </b-table>
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
    <div class="flex justify mt-4">
      <BaseLabel forId="someId">
        Total spending's: {{ totalPrice }}
      </BaseLabel>
    </div>
  </div>
  <footer_component></footer_component>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BaseLabel } from "@apiida/vue-components";
import Footer_component from "@/components/footer_component.vue";

interface Rental {
  Date: string;
  Device: string;
  Active: boolean;
  StartTime: string;
  EndTime: string;
  Price: string;
}

export default defineComponent({
  components: {
    BaseLabel,
    Footer_component,
  },
  setup() {
    const rentals: Rental[] = [
      {
        Date: '2024-04-03',
        Device: 'iPhone 12',
        Active: true,
        StartTime: '10:00 AM',
        EndTime: '04:00 PM',
        Price: '$19.99'
      },
      {
        Date: '2024-04-04',
        Device: 'MacBook Pro 16"',
        Active: true,
        StartTime: '09:00 AM',
        EndTime: '05:00 PM',
        Price: '$29.99'
      },
      {
        Date: '2024-04-05',
        Device: 'iPhone 13 Pro',
        Active: false,
        StartTime: '11:00 AM',
        EndTime: '03:00 PM',
        Price: '$21.99'
      },
      {
        Date: '2024-04-06',
        Device: 'iPad Pro',
        Active: true,
        StartTime: '08:00 AM',
        EndTime: '02:00 PM',
        Price: '$15.99'
      },
      {
        Date: '2024-04-07',
        Device: 'Samsung Galaxy S21',
        Active: false,
        StartTime: '12:00 PM',
        EndTime: '06:00 PM',
        Price: '$17.99'
      }
    ];

    const modalShow = ref(false);

    const fields = [
      { key: 'Date', label: 'Date' },
      { key: 'Device', label: 'Device' },
      { key: 'Active', label: 'Active', formatter: (value) => value ? 'Yes' : 'No' },
      { key: 'StartTime', label: 'Start Time' },
      { key: 'EndTime', label: 'End Time' },
      { key: 'Price', label: 'Price' },
      { key: 'actions', label: '', sortable: false }
    ];

    const selectedItem = ref<Rental>({
      Date: '',
      Device: '',
      Active: false,
      StartTime: '',
      EndTime: '',
      Price: ''
    });

    const totalPrice = ref<string>('');

    function handleClick(item: Rental) {
      modalShow.value = true;
      selectedItem.value = item;
    }
    function calculateTotalPrice() {
      let total = 0;
      rentals.forEach((rental) => {
        if (rental) {
          const price = parseFloat(rental.Price.substring(1));
          total += price;
        }
      });
      totalPrice.value = `$${total.toFixed(2)}`;
    }
    calculateTotalPrice();

    return {
      rentals,
      fields,
      totalPrice,
      selectedItem,
      handleClick,
      modalShow,
    }
  },
})
</script>

<style scoped>
.modal-content {
  max-width: 500px;
}
</style>

