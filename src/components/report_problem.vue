<template>
  <div class="report-container">
    <h2>Report a Problem</h2>
    <form @submit.prevent="submitReport" class="form-container">
      <div class="form-group">
        <label for="description">Problem Description:</label>
        <textarea id="description" v-model="report.description" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label for="file">Upload File:</label>
        <input type="file" id="file" @change="handleFileUpload" required>
        <button type="button" class="btn-file-upload" @click="saveFile">Save File</button>
      </div>
      <button type="submit" class="submit-btn">Submit Report</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ReportProblem',
  setup() {
    const report = ref({
      description: '',
      name: 'User 1',
      email: 'email123',
      file: null
    });

    const handleFileUpload = event => {
      report.value.file = event.target.files[0];  // store the file in the report object
      if (report.value.file) {
        console.log('File selected:', report.value.file.name);
      }
    };

    const saveFile = () => {
      console.log('File "saved"', report.value.file);  // Log the saved file, here you might implement actual file saving logic
    };

    const submitReport = () => {
      if (!report.value.description || !report.value.file) {
        console.log('Description or file is missing!');
        return;
      }
      console.log('Report submitted:', report.value);
      report.value = { description: '', file: null }; // Reset the form after submission
    };

    return { report, submitReport, handleFileUpload, saveFile };
  },
});
</script>

<!--<script lang="ts">-->
<!--import { defineComponent, ref } from 'vue';-->
<!--import axios from 'axios'; // Stelle sicher, dass axios importiert wird-->

<!--export default defineComponent({-->
<!--  name: 'ReportProblem',-->
<!--  setup() {-->
<!--    const report = ref({-->
<!--      description: '',-->
<!--      file: null-->
<!--    });-->

<!--    const handleFileUpload = event => {-->
<!--      report.value.file = event.target.files[0];-->
<!--      if (report.value.file) {-->
<!--        console.log('File selected:', report.value.file.name);-->
<!--      }-->
<!--    };-->

<!--    const submitReport = async () => {-->
<!--      if (!report.value.description || !report.value.file) {-->
<!--        console.log('Description or file is missing!');-->
<!--        return;-->
<!--      }-->

<!--      const formData = new FormData();-->
<!--      formData.append('description', report.value.description);-->
<!--      formData.append('file', report.value.file);-->

<!--      try {-->
<!--        const response = await axios.post('http://your-backend-url.com/api/report', formData, {-->
<!--          headers: {-->
<!--            'Content-Type': 'multipart/form-data'-->
<!--          }-->
<!--        });-->
<!--        console.log('Response:', response.data);-->
<!--        report.value = { description: '', file: null }; // Reset the form after submission-->
<!--      } catch (error) {-->
<!--        console.error('Error submitting report:', error);-->
<!--      }-->
<!--    };-->

<!--    return { report, submitReport, handleFileUpload };-->
<!--  },-->
<!--});-->
<!--</script>-->

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
  width: 100%; /* Full width */
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input[type="file"],
.form-group textarea {
  width: 100%; /* Ensures the input and textarea are full width */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-file-upload {
  background-color: #9ba5af;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-file-upload:hover {
  background-color: #509a21;
}

.submit-btn {
  background-color: #4CAF50; /* Green */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px; /* Added margin for spacing */
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>
