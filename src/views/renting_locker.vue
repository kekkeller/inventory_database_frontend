<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Rent Device</h3>
    <b-table striped hover :items="devices" :fields="fields" class="w-full">
      <template #cell(edit)="data">
        <b-button variant="primary" @click="showDeviceDetails(data.item)">Details</b-button>
      </template>
      <template #cell(rent)="data">
        <b-button variant="success" @click="confirmBooking(data.item)">
          <div class="d-flex align-items-center justify-content-center">
            <BIconDoorOpen></BIconDoorOpen>
            <span class="ml-2">Rent Me</span>
          </div>
        </b-button>
      </template>
    </b-table>
    <!-- Confirmation Modal for renting devices -->
    <b-modal id="confirmation-modal" v-model="isConfirmationVisible" title="Confirm Booking" ok-title="Confirm" cancel-title="Cancel" @ok="rentDevice(selectedDevice)">
      Are you sure you want to book this device?
    </b-modal>
    <!-- PIN Display Modal -->
    <b-modal
      id="pin-display-modal"
      v-model="isPinDisplayVisible"
      title="Booking Confirmed"
      ok-only
      @ok="isPinDisplayVisible = false">
    <p>Your booking is confirmed. Here is your PIN:</p>
      <div class="pin-container pb-2">
        <div v-for="(digit) in pinDigits" class="pin-digit">
          {{ digit }}
        </div>
      </div>
<!--      <h3>{{ bookingPin }}</h3>-->
      <div style="display: flex; justify-content: center; align-items: center;">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2571.677878723729!2d8.635615477107361!3d49.86729527148667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd70834660fbb1%3A0xc6acb1a957e2bba0!2sHochschule%20Darmstadt!5e0!3m2!1sde!2sde!4v1714685002721!5m2!1sde!2sde" width="400" height="450" style="border:0;"  loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>

  </b-modal>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
const mapImage = new URL('../assets/map.JPG', import.meta.url).href;

interface Device {
  id: number;
  owner: string;
  date_of_purchase: string;
  rent_price_per_hour: number;
  active: boolean;
  description: string;
  brand: string;
  model: string;
  serial_no: string;
  qr_code: string;
  category_id: number;
}

export default defineComponent({
  methods: {},
  components: {},
  setup() {
    const devices = ref<Device[]>([]);
    const isModalVisible = ref(false);
    const selectedItem = ref<Device | null>(null);
    const bookingPin = ref('');
    const pinDigits = ref(["1","2","3","4"]);
    const isPinDisplayVisible = ref(false);
    const selectedDevice = ref<Device>({
      id: 0,
      owner: '',
      date_of_purchase: '',
      rent_price_per_hour: 0,
      active: false,
      description: '',
      brand: '',
      model: '',
      serial_no: '',
      qr_code: '',
      category_id: 0
    });

    const isConfirmationVisible = ref(false);
    const categories = ref<any[]>([]);

    function getCurrentDateTime() {
      const date = new Date();
      return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    const fields = [
      { key: 'model', label: 'Model' },
      { key: 'brand', label: 'Brand' },
      { key: 'rent_price_per_hour', label: 'Price per Hour' },
      { key: 'rent', label: '', sortable: false },
    ];

    const loadDevices = async () => {
      try {
        const response = await axios.get('/api/devices/unused');
        devices.value = response.data.filter((device: Device) => device.brand === 'Locker').map((device: Device) => ({
          ...device,
          category_id: getCategoryName(device.category_id)
        }));
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };

    const loadCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        categories.value = response.data;
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    const rentDevice = async (item: Device) => {
      try {
        const userId = sessionStorage.getItem('userId');

        const userIdNumber = userId ? parseInt(userId) : 0;

        const bookingData = {
          time_start: getCurrentDateTime(),
          time_end: getCurrentDateTime(),
          active: true,
          booking_price: item.rent_price_per_hour,
          device_id: item.id,
          user_id: userIdNumber,
          rent_charge: 'charge',
          pin: 0
        };
        console.log(bookingData);
        await axios.post('/api/bookings', bookingData).then(response => { bookingPin.value = response.data.pin });
        pinDigits.value = bookingPin.value.toString().split("");
        console.log(pinDigits);
        console.log('Device rented successfully:', item);
        isPinDisplayVisible.value = true;
        await loadDevices();
      } catch (error) {
        console.error('Error renting device:', error);
      }
    };

    const showDeviceDetails = (item: Device) => {
      selectedItem.value = item;
      isModalVisible.value = true;
    };

    const getCategoryName = (categoryId: number) => {
      const category = categories.value.find(cat => cat.id === categoryId);
      return category ? category.name : '';
    };

    const confirmBooking = (item: Device) => {
      selectedDevice.value = item;
      isConfirmationVisible.value = true;
    };

    onMounted(async () => {
      await loadCategories();
      await loadDevices();
    });

    return {
      devices,
      fields,
      isModalVisible,
      selectedItem,
      selectedDevice,
      getCategoryName,
      showDeviceDetails,
      rentDevice,
      confirmBooking,
      isConfirmationVisible,
      bookingPin,
      isPinDisplayVisible,
      mapImage,
      pinDigits,
    };
  },
});
</script>
<style>
.pin-container {
  display: flex;
  justify-content: center;
  font-family: Arial, sans-serif;
}

.pin-digit {
  margin: 0 10px;
  text-align: center;
  font-size: 36px; /* Increase font size */
  color: #333; /* Adjust color as needed */
  border: 1px solid #333; /* Add thin border around each digit */
  border-radius: 5px; /* Add rounded corners for a softer look */
  width: 60px; /* Set width to create equal-sized boxes */
  height: 60px; /* Set height to create equal-sized boxes */
  line-height: 60px; /* Vertically center the digit */
}

/* You can add more styling or animations as needed */
</style>