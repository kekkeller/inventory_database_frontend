<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <div>
      <h3 class="text-left">Rent Locker</h3>
      <b-table striped hover :items="devices" :fields="fields" class="w-full">
        <template #cell(edit)="data">
          <b-button variant="primary" @click="showDeviceDetails(data.item)">Details</b-button>
        </template>
      </b-table>
      <b-modal id="details-modal" v-model="isModalVisible" title="Device Details" ok-only ok-title="Close">
        <template v-if="selectedItem">
          <p><b>Location:</b> {{ selectedItem.owner }}</p>
          <p><b>Description:</b> {{ selectedItem.description }}</p>
          <p><b>Brand:</b> {{ selectedItem.brand }}</p>
          <p><b>Model:</b> {{ selectedItem.model }}</p>
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
      { key: 'model', label: 'Location' },
      { key: 'description', label: 'Description' },
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
