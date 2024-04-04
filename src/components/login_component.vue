<template>
  <div class="justify-center">
    <BaseLabel class="mb-10 text-4xl">
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
import { useRouter } from 'vue-router';
import {AstronautRafiki, BaseLabel, IconAvatar} from "@apiida/vue-components";

export default defineComponent({
  name: 'LoginComponent',
  components: {BaseLabel, AstronautRafiki, IconAvatar},
  setup() {
    const credentials = ref({ email: '', password: '' });
    const errorMessage = ref('');
    const router = useRouter();

    const login = () => {
      errorMessage.value = ''; // Reset the error message on each login attempt

      if (credentials.value.email && credentials.value.password) {
        // Assuming login is successful
        console.log('Login successful with:', credentials.value);

        // Set isAuthenticated flag in sessionStorage
        sessionStorage.setItem('isAuthenticated', 'true');

        // Navigate to the home page
        router.push('/');
      } else {
        // If validation fails, set an error message
        errorMessage.value = 'Login failed. Please check your credentials.';
      }
    };

    return { credentials, login, errorMessage };
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
