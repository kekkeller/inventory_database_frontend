<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Devices</h3>
    <b-table striped hover :items="devices" :fields="fields" class="w-full">
      <template #cell(edit)="data">
        <b-button variant="primary" @click="editDevice(data.item)">Edit</b-button>
      </template>
      <template #cell(delete)="data">
        <b-button variant="danger" @click="confirmDelete(data.item.id)">Delete</b-button>
      </template>
    </b-table>

    <!-- Modal for editing device details -->
    <b-modal id="edit-modal" v-model="isEditModalVisible" title="Edit Device" @ok="saveDevice">
      <b-form-input v-model="editableDevice.owner" placeholder="Owner" required></b-form-input>
      <b-form-input v-model="editableDevice.date_of_purchase" placeholder="Purchase Date" type="date" required></b-form-input>
      <b-form-input v-model="editableDevice.price" placeholder="Price" type="number" required></b-form-input>
      <b-form-checkbox v-model="editableDevice.active">Active</b-form-checkbox>
      <b-form-input v-model="editableDevice.description" placeholder="Description" required></b-form-input>
      <b-form-input v-model="editableDevice.brand" placeholder="Brand" required></b-form-input>
      <b-form-input v-model="editableDevice.model" placeholder="Model" required></b-form-input>
      <b-form-input v-model="editableDevice.serial_no" placeholder="Serial Number" required></b-form-input>
      <b-form-input v-model="editableDevice.qr_code" placeholder="QR Code" required></b-form-input>
      <b-form-input v-model="editableDevice.category_id" placeholder="Category ID" required></b-form-input>
    </b-modal>

    <!-- Confirmation Modal for deleting devices -->
    <b-modal id="delete-modal"
             v-model="isDeleteModalVisible"
             title="Confirm Delete"
             @ok="deleteDevice"
             ok-title="Yes"
             ok-variant="danger">
      Are you sure you want to delete this device?
    </b-modal>
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
    const isEditModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);
    const editableDevice = ref<Device>({
      id: 0,
      owner: '',
      date_of_purchase: '',
      price: 0,
      active: false,
      description: '',
      brand: '',
      model: '',
      serial_no: '',
      qr_code: '',
      category_id: 0
    });

    const loadDevices = async () => {
      try {
        const response = await axios.get('/api/devices');
        devices.value = response.data;
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };

    onMounted(loadDevices);

    const editDevice = (device: Device) => {
      editableDevice.value = { ...device };
      isEditModalVisible.value = true;
    };

    const saveDevice = async () => {
      if (editableDevice.value) {
        try {
          await axios.put(`/api/devices/${editableDevice.value.id}`, editableDevice.value);
          isEditModalVisible.value = false;
          await loadDevices();
        } catch (error) {
          console.error('Failed to update device:', error);
        }
      }
    };

    const confirmDelete = (id: number) => {
      isDeleteModalVisible.value = true;
      editableDevice.value = devices.value.find(d => d.id === id) || {
        id: 0,
        owner: '',
        date_of_purchase: '',
        price: 0,
        active: false,
        description: '',
        brand: '',
        model: '',
        serial_no: '',
        qr_code: '',
        category_id: 0
      };
    };

    const deleteDevice = async () => {
      if (editableDevice.value) {
        try {
          await axios.delete(`/api/devices/${editableDevice.value.id}`);
          isDeleteModalVisible.value = false;
          await loadDevices();
        } catch (error) {
          console.error('Failed to delete device:', error);
        }
      }
    };

    const fields = [
      { key: 'owner', label: 'Owner' },
      { key: 'date_of_purchase', label: 'Purchase Date' },
      { key: 'price', label: 'Price' },
      { key: 'active', label: 'Active' },
      { key: 'description', label: 'Description' },
      { key: 'brand', label: 'Brand' },
      { key: 'model', label: 'Model' },
      { key: 'serial_no', label: 'Serial Number' },
      { key: 'qr_code', label: 'QR Code' },
      { key: 'category_id', label: 'Category ID' },
      { key: 'edit', label: 'Edit', sortable: false },
      { key: 'delete', label: 'Delete', sortable: false }
    ];

    return {
      devices,
      fields,
      editDevice,
      saveDevice,
      confirmDelete,
      deleteDevice,
      isEditModalVisible,
      isDeleteModalVisible,
      editableDevice
    };
  },
});
</script>
