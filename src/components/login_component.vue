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
import { useRouter } from 'vue-router';
import axios from 'axios'; // Import axios
import { BaseLabel } from "@apiida/vue-components";
import {useLoggedIn} from "../composable/useLoggedIn";

export default defineComponent({
  name: 'LoginComponent',
  components: { BaseLabel },
  setup() {
    const router = useRouter();
    const logoImageUrl = new URL('../assets/logo.png', import.meta.url).href;
    const credentials = ref({ email: '', password: '' });
    const errorMessage = ref('');
    const {setLoggedIn} = useLoggedIn();

    const login = async () => {
      errorMessage.value = '';
      try {
        // Verwende URLSearchParams, um die Parameter sicher zu kodieren
        const params = new URLSearchParams();
        params.append('email', credentials.value.email);
        params.append('password', credentials.value.password);

        const response = await axios.post('/api/loginIsValid?' + params.toString());

        // Hier folgt die Logik basierend auf der Antwort
        if (response.data && response.data.role) {
          const role = response.data.role === 'admin' ? 'Admin' : 'User';
          console.log(response.data);
          sessionStorage.setItem('userId', response.data.id);
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('isAdmin', role === 'Admin' ? 'true' : 'false');
          setLoggedIn(role);
          const destinationRoute = role === 'Admin' ? '/adminDashboard' : '/';
          await router.push(destinationRoute);
        } else {
          errorMessage.value = 'Login failed. Please check your credentials.';
        }
      } catch (error) {
        console.error('Login request failed:', error);
        errorMessage.value = 'Login failed. Please check your credentials.';
      }
    };

    return {
      logoImageUrl,
      credentials,
      errorMessage,
      login
    };
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
