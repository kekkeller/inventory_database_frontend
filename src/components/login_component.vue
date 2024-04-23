<template>
  <div class="d-flex flex-column align-items-center text-center">
    <img :src="logoImageUrl" alt="Icon" class="h-32 w-auto">
    <BaseLabel class="mb-10 text-3xl xl:text-5xl">
      Welcome to the Inventory Management Database!
    </BaseLabel>
  </div>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="credentials.email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="credentials.password" required>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios'; // Import axios for making HTTP requests
import { useRouter } from 'vue-router';
import { BaseLabel } from "@apiida/vue-components";

export default defineComponent({
  name: 'LoginComponent',
  components: { BaseLabel },
  setup() {
    const logoImageUrl = new URL('../assets/logo.png', import.meta.url).href;
    const credentials = ref({ email: '', password: '' });
    const errorMessage = ref('');
    const router = useRouter();
    const apiUrl = 'https://run.mocky.io/v3/c272bcdf-815e-4312-85f6-ea7630d0cbfd';  // Change this URL to our actual API endpoint

    const login = async () => {
      errorMessage.value = ''; // Reset the error message on each login attempt
      if (!credentials.value.email || !credentials.value.password) {
        errorMessage.value = 'Both email and password are required.';
        return;
      }

      try {
        const response = await axios.post(apiUrl, {
          email: credentials.value.email,
          password: credentials.value.password
        });

        if (response.data.success) {
          console.log('Login successful with:', credentials.value);
          sessionStorage.setItem('isAuthenticated', 'true');
          router.push('/');
        } else {
          throw new Error('Login failed. Please check your credentials.');
        }
      } catch (error) {
        errorMessage.value = error.message || 'An unexpected error occurred.';
      }
    };

    return { credentials, login, errorMessage, logoImageUrl };
  }
});
</script>

<style>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: red;
  margin-top: -10px;
  margin-bottom: 10px;
}

.login-container form div {
  margin-bottom: 15px;
}

.login-container form label {
  display: block;
  margin-bottom: 5px;
}

.login-container form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
