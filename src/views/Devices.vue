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
      <b-form-input v-model="editableDevice.owner" placeholder="Owner"></b-form-input>
      <b-form-input v-model="editableDevice.purchaseDate" placeholder="Purchase Date" type="date"></b-form-input>
      <b-form-input v-model="editableDevice.price" placeholder="Price"></b-form-input>
      <b-form-checkbox v-model="editableDevice.active">Active</b-form-checkbox>
      <b-form-textarea v-model="editableDevice.info" placeholder="Info"></b-form-textarea>
      <b-form-input v-model="editableDevice.brand" placeholder="Brand"></b-form-input>
      <b-form-input v-model="editableDevice.model" placeholder="Model"></b-form-input>
      <b-form-input v-model="editableDevice.image" placeholder="Image URL"></b-form-input>
      <b-form-input v-model="editableDevice.serialNumber" placeholder="Serial Number"></b-form-input>
      <b-form-input v-model="editableDevice.qrCode" placeholder="QR Code"></b-form-input>
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
  <footer_component></footer_component>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import Footer_component from "@/components/footer_component.vue";

interface Device {
  id: number;
  owner: string;
  purchaseDate: string;
  price: string;
  active: boolean;
  info: string;
  brand: string;
  model: string;
  image: string;
  serialNumber: string;
  qrCode: string;
}

export default defineComponent({
  components: { Footer_component },
  setup() {
    const devices = ref<Device[]>([
      // Beispiel-Daten für Devices
      { id: 1, owner: "John Doe", purchaseDate: "2021-04-22", price: "1200", active: true, info: "New model, fast processing", brand: "Dell", model: "XPS 15", image: "url", serialNumber: "SN123456", qrCode: "QR123456" },
      { id: 2, owner: "Jane Smith", purchaseDate: "2020-03-18", price: "800", active: false, info: "Old model, still reliable", brand: "HP", model: "Pavilion 15", image: "url", serialNumber: "SN789012", qrCode: "QR789012" },
    ]);
    const isEditModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);
    const deletingDeviceId = ref<number | null>(null);

    const editableDevice = ref<Device>({
      id: 0,
      owner: '',
      purchaseDate: '',
      price: '',
      active: false,
      info: '',
      brand: '',
      model: '',
      image: '',
      serialNumber: '',
      qrCode: ''
    });


    const fields = [
      { key: 'owner', label: 'Owner' },
      { key: 'purchaseDate', label: 'Purchase Date' },
      { key: 'price', label: 'Price' },
      { key: 'active', label: 'Active' },
      { key: 'info', label: 'Info' },
      { key: 'brand', label: 'Brand' },
      { key: 'model', label: 'Model' },
      { key: 'image', label: 'Image' },
      { key: 'serialNumber', label: 'Serial Number' },
      { key: 'qrCode', label: 'QR Code' },
      { key: 'edit', label: 'Edit', sortable: false },
      { key: 'delete', label: 'Delete', sortable: false }
    ];

    const editDevice = (device: Device) => {
      editableDevice.value = { ...device };
      isEditModalVisible.value = true;
    };

    const saveDevice = () => {
      if (editableDevice.value) {
        const index = devices.value.findIndex(d => d.id === editableDevice.value.id);
        if (index !== -1) {
          devices.value[index] = {...editableDevice.value};
        }
        isEditModalVisible.value = false;
      }
    };

    const confirmDelete = (id: number) => {
      deletingDeviceId.value = id;
      isDeleteModalVisible.value = true;
    };

    const deleteDevice = () => {
      if (deletingDeviceId.value !== null) {
        devices.value = devices.value.filter(d => d.id !== deletingDeviceId.value);
        isDeleteModalVisible.value = false;
      }
    };

    return {
      devices,
      fields,
      editDevice,
      saveDevice,
      confirmDelete,
      deleteDevice,
      isEditModalVisible,
      isDeleteModalVisible,
      editableDevice,
      deletingDeviceId
    }
  },
})
</script>
