<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Renting Device</h3>
    <b-table striped hover :items="bookings" :fields="fields" class="w-full">
      <template #cell(actions)="{ item }">
        <b-button variant="secondary" v-if="!item.active" @click="showDetails(item)">Details</b-button>
        <b-button variant="danger" v-if="item.active" @click="showCloseBookingModal(item)">Close Booking</b-button>
      </template>
      <template #cell(charge)="{ item }">
        <b-button variant="secondary" v-if="item.active && item.rent_charge === 'charge'" @click="showVoltageModal">Charge Info</b-button>
      </template>
      <template #cell(time_start)="data">
        {{ formatDateTime(data.item.time_start) }}
      </template>
      <template #cell(time_end)="data">
        {{ formatDateTime(data.item.time_end) }}
      </template>
      <template #cell(device_id)="data">
        {{ deviceMap[data.item.device_id] }}
      </template>
    </b-table>

    <b-modal id="details-modal" v-model="isModalVisible" title="Booking Details" ok-only ok-title="Close">
      <template v-if="selectedItem">
        <p><strong>Start Time:</strong> {{ formatDateTime(selectedItem.time_start) }}</p>
        <p><strong>End Time:</strong> {{ formatDateTime(selectedItem.time_end) }}</p>
        <p><strong>Price:</strong> {{ selectedItem.booking_price }}</p>
        <p><strong>Device Model:</strong> {{ deviceMap[selectedItem.device_id] }}</p>
        <p><strong>Active:</strong> {{ selectedItem.active }}</p>
        <p><strong>Rent Charge:</strong> {{ selectedItem.rent_charge }}</p>
        <p><strong>PIN:</strong> {{ selectedItem.pin }}</p>
      </template>
    </b-modal>

    <b-modal id="close-booking-modal" v-model="isCloseBookingModalVisible" title="Confirm Closure" @ok="closeBooking">
      Are you sure you want to close this booking?
    </b-modal>

    <b-modal id="voltage-modal" v-model="isVoltageModalVisible" title="Voltage Information" size="lg" ok-only ok-title="Close">
      <div class="d-flex justify-content-center align-items-center pt-10">
        <iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2530450/widgets/852176"></iframe>
        <iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2530450/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&title=History+of+Wattage&type=line"></iframe>
      </div>
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
  booking_price: number;
  device_id: number;
  user_id: number;
  rent_charge: string;
  pin: number;
  id: number;
}

interface Device {
  id: number;
  model: string;
  rent_price_per_hour: number;
}

export default defineComponent({
  setup() {
    const bookings = ref<Booking[]>([]);
    const isModalVisible = ref(false);
    const isVoltageModalVisible = ref(false);
    const selectedItem = ref<Booking | null>(null);
    const isCloseBookingModalVisible = ref(false);
    const deviceMap = ref<Record<number, string>>({});

    const fields = [
      { key: 'time_start', label: 'Start Time' },
      { key: 'time_end', label: 'End Time' },
      { key: 'device_id', label: 'Device Model' },
      { key: 'actions', label: 'Actions', sortable: false },
      { key: 'charge', label: '', sortable: false }
    ];

    const fetchBookings = async () => {
      try {
        const userId = Number(sessionStorage.getItem('userId'));
        const response = await axios.get(`/api/bookings/allbyUserID/${userId}`);
        bookings.value = response.data;
        const deviceIds = bookings.value.map(booking => booking.device_id);
        await fetchDeviceDetails(deviceIds);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    const fetchDeviceDetails = async (deviceIds: number[]) => {
      const response = await axios.get(`/api/devices?ids=${deviceIds.join(',')}`);
      response.data.forEach((device: Device) => {
        deviceMap.value[device.id] = device.model;
      });
    };

    const showDetails = (item: Booking) => {
      selectedItem.value = item;
      isModalVisible.value = true;
    };

    const showCloseBookingModal = (item: Booking) => {
      selectedItem.value = item;
      isCloseBookingModalVisible.value = true;
    };

    const showVoltageModal = () => {
      isVoltageModalVisible.value = true;
    };

    const closeBooking = async () => {
      try {
        if (selectedItem.value) {
          const updatedBooking = { ...selectedItem.value, active: false, time_end: new Date().toISOString() };
          await axios.put(`/api/bookings/${selectedItem.value.id}`, updatedBooking);
          isCloseBookingModalVisible.value = false;
          await fetchBookings();
        }
      } catch (error) {
        console.error('Failed to close booking:', error);
      }
    };

    const formatDateTime = (dateTime: string) => {
      const date = new Date(dateTime);
      return date.toLocaleString();
    };

    onMounted(fetchBookings);

    return {
      bookings,
      fields,
      showDetails,
      isModalVisible,
      selectedItem,
      formatDateTime,
      isCloseBookingModalVisible,
      showCloseBookingModal,
      closeBooking,
      deviceMap,
      isVoltageModalVisible,
      showVoltageModal
    };
  }
});
</script>
