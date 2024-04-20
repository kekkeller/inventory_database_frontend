<template>
  <div class="report-container">
    <h2>Report a Problem</h2>
    <form ref="form" @submit.prevent="submitReport" class="form-container">
      <div class="form-group">
        <label for="description">Problem Description:</label>
        <textarea id="description" v-model="report.description" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label for="file">Upload File:</label>
        <input type="file" id="file" ref="fileInput" @change="handleFileUpload" required>
      </div>
      <button type="submit" class="submit-btn">Submit Report</button>
      <p v-if="submitted" class="success-message">Report has been successfully submitted!</p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'ReportProblem',
  setup() {
    const form = ref(null);
    const fileInput = ref(null);
    const report = reactive({
      description: '',
      file: null
    });
    const submitted = ref(false);

    const handleFileUpload = event => {
      report.file = event.target.files[0];
      if (report.file) {
        console.log('File selected:', report.file.name);
      }
    };

    const submitReport = async () => {
      if (!report.description || !report.file) {
        alert('Description and file are required!');
        return;
      }

      const formData = new FormData();
      formData.append('description', report.description);
      formData.append('file', report.file);

      try {
        const response = await axios.post('https://dbinveno.free.beeceptor.com', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Response:', response.data);
        submitted.value = true;
        setTimeout(() => { submitted.value = false; }, 5000);
        resetForm();
      } catch (error) {
        console.error('Error submitting report:', error);
        alert('Failed to submit the report.');
      }
    };

    const resetForm = () => {
      if (form.value) {
        form.value.reset();
        report.description = ''; // Reset Vue model
        report.file = null; // Reset Vue model
      }
      if (fileInput.value) {
        fileInput.value.value = ''; // Reset file input
      }
    };

    return { report, submitReport, handleFileUpload, submitted, form, fileInput };
  },
});
</script>

<style>

.report-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-group {
  width: 100%;
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input[type="file"],
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.submit-btn:hover {
  background-color: #45a049;
}
.success-message {
  color: green;
  margin-top: 20px;
}
</style>
