<template>
  <div class="report-container">
    <h2>Report a Problem</h2>
    <form @submit.prevent="submitReport">
      <div class="form-row">
        <div class="form-group half-width">
          <label for="name">Your Name:</label>
          <input type="text" id="name" v-model="report.name" required>
        </div>
        <div class="form-group half-width">
          <label for="email">Your Email:</label>
          <input type="email" id="email" v-model="report.email" required>
        </div>
      </div>
      <div class="form-group">
        <label for="categories">Category:</label>
        <select id="categories" v-model="report.category" required>
          <option disabled value="">Please select one</option>
          <option>Hardware Issue</option>
          <option>Software Issue</option>
          <option>Network Problem</option>
          <option>Other</option>
        </select>
      </div>
      <div class="form-group">
        <label for="description">Problem Description:</label>
        <textarea id="description" v-model="report.description" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label for="file">Upload File:</label>
        <input type="file" id="file" @change="handleFileUpload">
        <button type="button" class="mt-2" @click="saveFile">Save File</button>
      </div>
      <button type="submit">Submit Report</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ReportProblem',
  setup() {
    const report = ref({
      name: '',
      email: '',
      category: '',
      description: '',
    });

    const handleFileUpload = (event: Event) => {
      console.log('File selected:');
    };

    const saveFile = () => {
      console.log('File "saved"');
    };

    const submitReport = () => {
      console.log('Report submitted:', report.value);
      report.value = { name: '', email: '', category: '', description: '' };
    };

    return { report, submitReport, handleFileUpload, saveFile };
  },
});
</script>

<style>
.report-container {
  max-width: 70%;
  margin: auto;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  justify-content: space-between;
}

.half-width {
  width: 48%; /* Adjusts for margin/padding */
}

.form-group {
  margin-bottom: 20px;
  margin-top: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type="submit"], button[type="button"] {
  background-color: #9ba5af;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover, button[type="button"]:hover {
  background-color: #509a21;
}
</style>
