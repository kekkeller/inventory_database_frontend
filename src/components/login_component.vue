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
import { BaseLabel } from "@apiida/vue-components";
import {useLoggedIn} from "../composable/useLoggedIn";

export default defineComponent({
  name: 'LoginComponent',
  components: { BaseLabel },
  setup() {
    const logoImageUrl = new URL('../assets/logo.png', import.meta.url).href;
    const credentials = ref({ email: '', password: '' });
    const errorMessage = ref('');
    const router = useRouter();
    const {setLoggedIn} = useLoggedIn();

    // Statische Benutzerdaten
    const users = [
      { email: 'admin@admin.com', password: '123', isAdmin: true },
      { email: 'user@user.com', password: '123', isAdmin: false }
    ];

    const login = async () => {
      errorMessage.value = '';
      // Benutzerdaten überprüfen
      const user = users.find(u => u.email === credentials.value.email && u.password === credentials.value.password);
      if (user) {
        sessionStorage.setItem('isAuthenticated', 'true');
        setLoggedIn(user.isAdmin ? 'Admin' : 'User');
        const destinationRoute = user.isAdmin ? '/adminDashboard' : '/';
        await router.push(destinationRoute);
      } else {
        errorMessage.value = 'Login failed. Please check your credentials.';
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
