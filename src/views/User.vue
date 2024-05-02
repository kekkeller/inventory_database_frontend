<template>
    <div class="mx-auto my-10" style="width: 90%">
        <h3 class="text-left">User List</h3>
        <b-table striped hover :items="accounts" :fields="fields"></b-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';


interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default defineComponent({
  components: { },
  setup() {
    const accounts = ref<User[]>([]);
    const fields = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' }
    ];

    const loadUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        accounts.value = response.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    onMounted(loadUsers);

    return {
      accounts,
      fields,
    };
  },
});
</script>
