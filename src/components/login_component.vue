<template>
  <div class="d-flex flex-column align-items-center text-center">
    <img :src="logoImageUrl" alt="Icon" class="h-32 w-auto animate-pulse">
    <h1 class="pt-5">
      Welcome to the Inventory Management Database!
    </h1>
  </div>
  <div class="login-container p-4 shadow rounded bg-light" style="max-width: 400px; margin: 50px auto;">
    <h2 class="text-center mb-4">Login</h2>
    <form @submit.prevent="login" class="needs-validation" novalidate>
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input type="email" id="email" class="form-control" v-model="credentials.email" required>
        <div class="invalid-feedback">
          Please provide a valid email.
        </div>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" class="form-control" v-model="credentials.password" required>
        <div class="invalid-feedback">
          Password is required.
        </div>
      </div>
      <p v-if="errorMessage" class="error-message text-danger">{{ errorMessage }}</p>
      <div class="d-grid gap-2">
        <b-button type="submit" variant="success" class="btn-block">Login</b-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoggedIn } from "../composable/useLoggedIn";

export default defineComponent({
  name: 'LoginComponent',
  setup() {
    const router = useRouter();
    const logoImageUrl = new URL('../assets/logo.png', import.meta.url).href;
    const credentials = ref({ email: '', password: '' });
    const errorMessage = ref('');
    const { setLoggedIn } = useLoggedIn();

    const login = async () => {
      errorMessage.value = '';

      // Mocked login logic for admin and user
      const adminCredentials = { email: 'admin', password: 'admin' };
      const userCredentials = { email: 'user', password: 'user' };

      if (credentials.value.email === adminCredentials.email && credentials.value.password === adminCredentials.password) {
        sessionStorage.setItem('userId', '1');
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('isAdmin', 'true');
        setLoggedIn('Admin');
        await router.push('/adminDashboard');
      } else if (credentials.value.email === userCredentials.email && credentials.value.password === userCredentials.password) {
        sessionStorage.setItem('userId', '2');
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('isAdmin', 'false');
        setLoggedIn('User');
        await router.push('/');
      } else {
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
.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  } /* Hier fehlt eine schließende Klammer */
  100% {
    transform: scale(1);
  }
} /* Hier schließen wir den @keyframes-Block */
.login-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: red;
  margin-top: -10px;
  margin-bottom: 10px;
}

.login-container form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.login-container {
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.2);
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
}

.error-message {
  color: #dc3545; /* Bootstrap danger color */
}

input[type="email"],
input[type="password"] {
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
}

input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #e3e30e;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-label {
  margin-bottom: 0.5rem;
}

.d-grid button {
  padding: 0.75rem;
  font-size: 1.2rem;
}

</style>
