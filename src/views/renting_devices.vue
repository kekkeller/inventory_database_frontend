<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <div>
      <h3 class="text-left">Rent Device</h3>
      <b-table striped hover :items="devices" :fields="fields" class="w-full">
        <template #cell(image)="data">
          <img :src="data.item.image" alt="Device Image" class="img-fluid" style="width: 100px; height: auto; cursor: pointer;" @click="showLargeImage(data.item.image)">
        </template>
        <template #cell(edit)="data">
          <b-button variant="primary" @click="showDeviceDetails(data.item)">Details</b-button>
        </template>
        <template #cell(rent)="data">
          <b-button variant="success" @click="confirmBooking(data.item)">
            <div class="d-flex align-items-center justify-content-center">
              <BIconCartCheck></BIconCartCheck>
              <span class="ml-2">Rent Me</span>
            </div>
          </b-button>
        </template>
      </b-table>
      <b-modal id="details-modal" v-model="isModalVisible" title="Device Details" ok-only ok-title="Close">
        <template v-if="selectedItem">
          <p><b>Description:</b> {{ selectedItem.description }}</p>
          <p><b>Brand:</b> {{ selectedItem.brand }}</p>
          <p><b>Model:</b> {{ selectedItem.model }}</p>
          <p><b>Price per Hour:</b> {{ selectedItem.rent_price_per_hour }}</p>
          <p><b>QR Code:</b> {{ selectedItem.qr_code }}</p>
          <img :src="selectedItem.image" alt="Selected Device Image" class="img-fluid">
        </template>
      </b-modal>
      <b-modal id="confirmation-modal" v-model="isConfirmationVisible" title="Confirm Booking" ok-title="Confirm" cancel-title="Cancel" @ok="rentDevice(selectedDevice)">
        Are you sure you want to book this device?
      </b-modal>
      <b-modal id="pin-display-modal" v-model="isPinDisplayVisible" title="Booking Confirmed" ok-only @ok="isPinDisplayVisible = false">
        <p>Your booking is confirmed. Here is your PIN:</p>
        <h4>{{ bookingPin }}</h4>
      </b-modal>
      <b-modal id="image-modal" v-model="isImageModalVisible" title="View Image" size="lg" ok-only ok-title="Close">
        <img :src="largeImageUrl" alt="Large Device Image" class="img-fluid">
      </b-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

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
  image: string;
}

export default defineComponent({
  components: {},
  setup() {
    const devices = ref<Device[]>([]);
    const isModalVisible = ref(false);
    const isImageModalVisible = ref(false);
    const largeImageUrl = ref('');
    const isPinDisplayVisible = ref(false);
    const selectedItem = ref<Device | null>(null);
    const bookingPin = ref('');
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
      category_id: 0,
      image: ''
    });
    const isConfirmationVisible = ref(false);
    const categories = ref<any[]>([]);

    function getCurrentDateTime() {
      const date = new Date();
      return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    const fields = [
      { key: 'image', label: '' },
      { key: 'category_id', label: 'Category'},
      { key: 'model', label: 'Model' },
      { key: 'brand', label: 'Brand' },
      { key: 'rent_price_per_hour', label: 'Price per Hour' },
      { key: 'rent', label: '', sortable: false },
    ];

    const loadDevices = async () => {
      try {
        const response = await axios.get('https://f-itplfo6nya-uc.a.run.app/devices/unused');
        devices.value = response.data.filter((device: Device) => device.brand != 'Locker').map((device: Device) => ({
          ...device,
          category_id: getCategoryName(device.category_id)
        }));
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };

    const loadCategories = async () => {
      try {
        const response = await axios.get('https://f-itplfo6nya-uc.a.run.app/categories');
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
          rent_charge: 'rent',
          pin: 0
        };
        console.log(bookingData);
        await axios.post('https://f-itplfo6nya-uc.a.run.app/bookings', bookingData).then(response => { bookingPin.value = response.data.pin});
        isPinDisplayVisible.value = true;
        await loadDevices();
        console.log('Device rented successfully:', item);
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

    const showLargeImage = (imageUrl: string) => {
      largeImageUrl.value = imageUrl;
      isImageModalVisible.value = true;
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
      isPinDisplayVisible,
      bookingPin,
      isImageModalVisible,
      largeImageUrl,
      showLargeImage
    };
  },
});
</script>
