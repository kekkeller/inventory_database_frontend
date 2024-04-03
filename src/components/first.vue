<template>
  <div class="mockup-table">
    <BaseButton @click="addNewEntry">
      Add New Entry
    </BaseButton>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.name }}</td>
        <td class="email">{{ user.email }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {BaseButton, BaseButtonDialog} from "@apiida/vue-components";

export default defineComponent({
  name: 'MockupTable',
  components: {BaseButtonDialog, BaseButton},
  setup() {
    const users = ref([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
      { id: 3, name: 'Jack Doe', email: 'jack@example.com' }
    ]);

    // Method to add a new entry
    const addNewEntry = () => {
      const newId = users.value.length + 1; // Simple ID generation
      const newUser = {
        id: newId,
        name: `New User ${newId}`,
        email: `newuser${newId}@example.com`
      };
      users.value.push(newUser);
    };

    return { users, addNewEntry };
  }
});
</script>


<style>
/* Basic styling */
.email{
  width: 30%;
}
.mockup-table table {
  width: 100%;
  border-collapse: collapse;
}

.mockup-table th, .mockup-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.mockup-table th {
  background-color: #f2f2f2;
}
</style>
