<template>
  <div class="report-container">
    <h2>Report a Problem</h2>
    <form ref="formRef" @submit.prevent="submitReport" class="form-container">
      <div class="form-group">
        <label for="description">Problem Description:</label>
        <textarea id="description" v-model="report.description" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label for="image">Image URL:</label>
        <input type="text" id="image" v-model="report.image" required>
      </div>
      <div class="form-group">
        <label for="booking">Select Booking:</label>
        <select id="booking" v-model="report.booking_id" required>
          <option v-for="booking in bookings" :key="booking.id" :value="booking.id">{{ booking.id }}</option>
        </select>
      </div>
      <button type="submit" class="submit-btn">Submit Report</button>
      <p v-if="submitted" class="success-message">Report has been successfully submitted!</p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

interface Report {
  date: string;
  description: string;
  image: string;
  booking_id: number | null;
}

interface Booking {
  id: number;
}

export default defineComponent({
  name: 'ReportProblem',
  setup() {

    function getCurrentDateTime() {
      const date = new Date();
      return date.toISOString().slice(0, 19).replace('T', ' ');
    }


    const formRef = ref<HTMLFormElement | null>(null);
    const report = ref<Report>({
      date: '',
      description: '',
      image: '',
      booking_id: null
    });
    const submitted = ref(false);
    const bookings = ref<Booking[]>([]);



    const submitReport = async () => {
      if (!report.value.description || !report.value.image || !report.value.booking_id) {
        alert('Description, image URL, and booking are required!');
        return;
      }

      report.value.date = getCurrentDateTime();

      try {
        const response = await axios.post('https://f-itplfo6nya-uc.a.run.app/reports', report.value);
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
      const form = formRef.value;
      if (form) {
        form.reset();
        report.value.description = '';
        report.value.image = '';
        report.value.booking_id = null;
      }
    };

    const fetchBookings = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`https://f-itplfo6nya-uc.a.run.app/bookings/allbyUserID/${userId}`);
        bookings.value = response.data;
      } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('Failed to fetch bookings.');
      }
    };

    onMounted(() => {
      fetchBookings();
    });

    return { formRef, report, submitReport, submitted, bookings };
  },
});
</script>

<style>
.report-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 10px; /* Abgerundete Ecken hinzugefügt */
  font-family: Arial, sans-serif; /* Verwendung der Standard-Schriftart des Projekts */
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

.form-group input[type="text"],
.form-group textarea,
.form-group select {
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

