<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <div>
      <h3 class="text-left">Devices</h3>
      <div class="d-flex justify-content-end mb-3">
        <b-button variant="success" @click="openAddDeviceModal">Add New Device</b-button>
      </div>
      <b-table striped hover :items="devices" :fields="fields" class="w-full">
        <template #cell(edit)="data">
          <b-button variant="primary" @click="editDevice(data.item)">Edit</b-button>
        </template>
        <template #cell(delete)="data">
          <b-button variant="danger" @click="confirmDelete(data.item.id)">Delete</b-button>
        </template>
      </b-table>

      <!-- Modal for adding new device -->
      <b-modal id="add-modal" v-model="isAddModalVisible" title="Add New Device" @ok="addDevice">
        <div class="form-group">
          <label for="owner">Owner:</label>
          <b-form-input id="owner" v-model="newDevice.owner"  required></b-form-input>
        </div>

        <div class="form-group">
          <label for="date_of_purchase">Purchase Date:</label>
          <b-form-input id="date_of_purchase" v-model="newDevice.date_of_purchase"  ></b-form-input>
        </div>

        <div class="form-group">
          <label for="purchase_price">Purchase Price:</label>
          <b-form-input id="purchase_price" v-model="newDevice.purchase_price"  type="number" required></b-form-input>
        </div>

        <div class="form-group">
          <label for="rent_price_per_hour">Rent Price per Hour:</label>
          <b-form-input id="rent_price_per_hour" v-model="newDevice.rent_price_per_hour" type="number" required></b-form-input>
        </div>

        <div class="form-group">
          <b-form-checkbox v-model="newDevice.active">Active</b-form-checkbox>
        </div>

        <div class="form-group">
          <label for="description">Description:</label>
          <b-form-input id="description" v-model="newDevice.description"  required></b-form-input>
        </div>

        <div class="form-group">
          <label for="brand">Brand:</label>
          <b-form-input id="brand" v-model="newDevice.brand" required></b-form-input>
        </div>

        <div class="form-group">
          <label for="model">Model:</label>
          <b-form-input id="model" v-model="newDevice.model" required></b-form-input>
        </div>

        <div class="form-group">
          <label for="serial_no">Serial Number:</label>
          <b-form-input id="serial_no" v-model="newDevice.serial_no" required></b-form-input>
        </div>

        <div class="form-group">
          <label for="qr_code">QR Code:</label>
          <b-form-input id="qr_code" v-model="newDevice.qr_code"  required></b-form-input>
        </div>

        <div class="form-group">
          <label for="category">Category:</label>
          <!-- Dropdown menu for categories -->
          <b-form-select id="category" v-model="newDevice.category_id" :options="categoryOptions" required></b-form-select>
        </div>
      </b-modal>


      <!-- Modal for editing device details -->
      <b-modal id="edit-modal" v-model="isEditModalVisible" title="Edit Device" @ok="saveDevice">
        <b-form-input v-model="editableDevice.owner" placeholder="Owner" required></b-form-input>
        <b-form-input v-model="editableDevice.date_of_purchase" placeholder="Purchase Date" required></b-form-input>
        <b-form-input v-model="editableDevice.purchase_price" placeholder="Price" type="number" required></b-form-input>
        <b-form-input v-model="editableDevice.rent_price_per_hour" placeholder="Price" type="number" required></b-form-input>
        <b-form-checkbox v-model="editableDevice.active">Active</b-form-checkbox>
        <b-form-input v-model="editableDevice.description" placeholder="Description" required></b-form-input>
        <b-form-input v-model="editableDevice.image" placeholder="Image" required></b-form-input>
        <b-form-input v-model="editableDevice.brand" placeholder="Brand" required></b-form-input>
        <b-form-input v-model="editableDevice.model" placeholder="Model" required></b-form-input>
        <b-form-input v-model="editableDevice.serial_no" placeholder="Serial Number" required></b-form-input>
        <b-form-input v-model="editableDevice.qr_code" placeholder="QR Code" required></b-form-input>
        <!-- Dropdown menu for categories -->
        <b-form-select v-model="editableDevice.category_id" :options="categoryOptions" required></b-form-select>
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

  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

interface Device {
  id: number;
  owner: string;
  date_of_purchase: string;
  purchase_price: number;
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
    const isAddModalVisible = ref(false);
    const isEditModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);
    const editableDevice = ref<Device>({
      id: 0,
      owner: '',
      date_of_purchase: '',
      purchase_price: 0,
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
    const newDevice = ({
      owner: '',
      date_of_purchase: '',
      purchase_price: 0,
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

    const categories = ref<any[]>([]);
    const categoryOptions = ref<any[]>([]);

    const loadDevices = async () => {
      try {
        const response = await axios.get('/api/devices');
        devices.value = response.data.map((device: Device) => ({
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
        categoryOptions.value = categories.value.map((category: any) => ({
          value: category.id,
          text: category.name
        }));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    onMounted(async () => {
      await loadCategories();
      await loadDevices();
    });

    const openAddDeviceModal = () => {
      isAddModalVisible.value = true;
    };

    const addDevice = async () => {
      try {
        await axios.post('/api/devices', newDevice);
        isAddModalVisible.value = false;
        await loadDevices();
      } catch (error) {
        console.error('Failed to add device:', error);
      }
    };

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
        rent_price_per_hour: 0,
        purchase_price: 0,
        active: false,
        description: '',
        brand: '',
        model: '',
        serial_no: '',
        qr_code: '',
        category_id: 0,
        image: ''
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
      { key: 'description', label: 'Description' },
      { key: 'brand', label: 'Brand' },
      { key: 'model', label: 'Model' },
      { key: 'serial_no', label: 'Serial Number' },
      { key: 'qr_code', label: 'QR Code' },
      { key: 'category_id', label: 'Category' },
      { key: 'edit', label: 'Edit', sortable: false },
      { key: 'delete', label: 'Delete', sortable: false }
    ];

    const getCategoryName = (categoryId: number) => {
      const category = categories.value.find(cat => cat.id === categoryId);
      return category ? category.name : '';
    };

    return {
      devices,
      fields,
      openAddDeviceModal,
      addDevice,
      editDevice,
      saveDevice,
      confirmDelete,
      deleteDevice,
      isAddModalVisible,
      isEditModalVisible,
      isDeleteModalVisible,
      newDevice,
      editableDevice,
      categoryOptions
    };
  },
});
</script>
