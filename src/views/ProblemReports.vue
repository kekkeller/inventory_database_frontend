<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Problem Reports</h3>
    <b-table :items="reports" :fields="fields" class="w-full">
      <template #cell(view)="data">
        <b-button variant="info" @click="viewReport(data.item)">
          <div class="d-flex align-items-center justify-content-center buttonsize">
            <BIconInfoCircle></BIconInfoCircle>
            <span class="ml-2">Details</span>
          </div>
          </b-button>
      </template>
    </b-table>
    <!-- Modal for viewing reports -->
    <b-modal id="view-modal" v-model="isViewModalVisible" title="Report Details" ok-only ok-title="Close">
      <div>
        <p><strong>Date:</strong> {{ selectedReport.date }}</p>
        <img :src="selectedReport.image" alt="Report Photo" class="w-full">
        <p><strong>Description:</strong> {{ selectedReport.description }}</p>
      </div>
    </b-modal>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { BTable, BButton, BModal } from 'bootstrap-vue-3';

interface Report {
  date: string;
  description: string;
  image: string;
  booking_id: number;
  id: number;
}

export default defineComponent({
  components: { BTable, BButton, BModal },
  setup() {
    const reports = ref<Report[]>([]);
    const isViewModalVisible = ref(false);
    const selectedReport = ref<Report>({
      date: '',
      description: '',
      image: '',
      booking_id: 0,
      id: 0,
    });

    const fields = [
      { key: 'date', label: 'Date' },
      { key: 'description', label: 'Description' },
      { key: 'view', label: '', sortable: false },
    ];

    const loadReports = async () => {
      try {
        const response = await axios.get('/api/reports');
        reports.value = response.data;
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };

    onMounted(loadReports);

    const viewReport = (report: Report) => {
      selectedReport.value = report;
      isViewModalVisible.value = true;
    };


    return {
      reports,
      fields,
      viewReport,
      isViewModalVisible,
      selectedReport
    };
  }
});
</script>
