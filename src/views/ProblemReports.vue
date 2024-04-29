<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Problem Reports</h3>
    <b-table :items="reports" :fields="fields" class="w-full">
      <template #cell(view)="data">
        <b-button variant="info" @click="viewReport(data.item)">View</b-button>
      </template>
      <template #cell(delete)="data">
        <b-button variant="danger" @click="confirmDelete(data.item.id)">Delete</b-button>
      </template>
    </b-table>


    <!-- Modal for viewing reports -->
    <b-modal id="view-modal" v-model="isViewModalVisible" title="Report Details" ok-only ok-title="Close">
      <div>
        <p><strong>User ID:</strong> {{ selectedReport.userId }}</p>
        <img :src="selectedReport.photo" alt="Report Photo" class="w-full">
        <p>{{ selectedReport.description }}</p>
      </div>
    </b-modal>

    <!-- Confirmation Modal for deleting reports -->
    <b-modal id="delete-modal" v-model="isDeleteModalVisible" title="Confirm Delete" ok-title="Yes" @ok="deleteReport" ok-variant="danger">
      Are you sure you want to delete this report?
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BTable, BButton, BModal } from 'bootstrap-vue-3';

export default defineComponent({
  components: { BTable, BButton, BModal },
  setup() {
    const reports = ref([
      { id: 1, userId: 101, photo: 'url_to_photo1.jpg', description: 'Problem with item X' },
      { id: 2, userId: 102, photo: 'url_to_photo2.jpg', description: 'Issue with service Y' },
      { id: 3, userId: 103, photo: 'url_to_photo3.jpg', description: 'Delivery issue on order Z' },
      { id: 4, userId: 104, photo: 'url_to_photo4.jpg', description: 'Faulty product found' },
      { id: 5, userId: 105, photo: 'url_to_photo5.jpg', description: 'Software error encountered' }
    ]);

    const fields = [
      { key: 'userId', label: 'User ID' },
      { key: 'description', label: 'Description' },
      { key: 'view', label: 'View', sortable: false },
      { key: 'delete', label: 'Delete', sortable: false }
    ];

    const isViewModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);
    const selectedReport = ref({});

    const viewReport = (report) => {
      selectedReport.value = report;
      isViewModalVisible.value = true;
    };

    const confirmDelete = (id) => {
      selectedReport.value = reports.value.find(r => r.id === id);
      isDeleteModalVisible.value = true;
    };

    const deleteReport = () => {
      reports.value = reports.value.filter(r => r.id !== selectedReport.value.id);
      isDeleteModalVisible.value = false;
    };

    return {
      reports,
      fields,
      viewReport,
      confirmDelete,
      deleteReport,
      isViewModalVisible,
      isDeleteModalVisible,
      selectedReport
    };
  }
});
</script>
