<template>
  <div class="report-container">
    <h2>Report a Problem</h2>
    <form @submit.prevent="submitReport">
      <div class="form-group">
        <label for="name">Your Name:</label>
        <input type="text" id="name" v-model="report.name" required>
      </div>
      <div class="form-group">
        <label for="email">Your Email:</label>
        <input type="email" id="email" v-model="report.email" required>
      </div>
      <div class="form-group">
        <label for="description">Problem Description:</label>
        <textarea id="description" v-model="report.description" rows="4" required></textarea>
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
      description: '',
    });

    const submitReport = () => {
      // Here you would normally handle the report submission, e.g., sending it to a backend.
      console.log('Report submitted:', report.value);
      // Reset form or give user feedback
    };

    return { report, submitReport };
  },
});
</script>

<style>
.report-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}
</style>
