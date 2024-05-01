<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <div>
      <h3 class="text-left">Rent Locker</h3>
      <b-table striped hover :items="devices" :fields="fields" class="w-full">
        <template #cell(edit)="data">
          <b-button variant="primary" @click="showDeviceDetails(data.item)">Details</b-button>
        </template>
      </b-table>

      <!-- Modal for displaying device details -->
      <b-modal id="details-modal" v-model="isModalVisible" title="Device Details" ok-only ok-title="Close">
        <template v-if="selectedItem">
          <p><b>Owner:</b> {{ selectedItem.owner }}</p>
          <p><b>Date of Purchase:</b> {{ selectedItem.date_of_purchase }}</p>
          <p><b>Price:</b> {{ selectedItem.price }}</p>
          <p><b>Active:</b> {{ selectedItem.active }}</p>
          <p><b>Description:</b> {{ selectedItem.description }}</p>
          <p><b>Brand:</b> {{ selectedItem.brand }}</p>
          <p><b>Model:</b> {{ selectedItem.model }}</p>
          <p><b>Serial Number:</b> {{ selectedItem.serial_no }}</p>
          <p><b>QR Code:</b> {{ selectedItem.qr_code }}</p>
          <p><b>Category:</b> {{ getCategoryName(selectedItem.category_id) }}</p>
        </template>
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
  price: number;
  active: boolean;
  description: string;
  brand: string;
  model: string;
  serial_no: string;
  qr_code: string;
  category_id: number;
}

export default defineComponent({
  components: {},
  setup() {
    const devices = ref<Device[]>([]);
    const isModalVisible = ref(false);
    const selectedItem = ref<Device | null>(null);
    const categories = ref<any[]>([]);

    const fields = [
      { key: 'price', label: 'Price' },
      { key: 'active', label: 'Active' },
      { key: 'brand', label: 'Brand' },
      { key: 'model', label: 'Model' },
      { key: 'category_id', label: 'Category' },
      { key: 'edit', label: 'Details', sortable: false },
    ];

    const loadDevices = async () => {
      try {
        const response = await axios.get('/api/devices');
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

    const showDeviceDetails = (item: Device) => {
      selectedItem.value = item;
      isModalVisible.value = true;
    };

    const getCategoryName = (categoryId: number) => {
      const category = categories.value.find(cat => cat.id === categoryId);
      return category ? category.name : '';
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
      getCategoryName,
      showDeviceDetails
    };
  },
});
</script>
