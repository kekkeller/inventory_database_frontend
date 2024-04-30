<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <div class="d-flex justify-content-between mb-3">
      <h3 class="text-left">Categories</h3>
      <b-button @click="showCreateModal" variant="success">Create New Category</b-button>
    </div>
    <b-table striped hover :items="categories" :fields="fields" class="w-full">
      <template #cell(edit)="data">
        <b-button variant="primary" @click="editCategory(data.item)">Edit</b-button>
      </template>
      <template #cell(delete)="data">
        <b-button variant="danger" @click="confirmDelete(data.item.id)">Delete</b-button>
      </template>
    </b-table>

    <!-- Modal for creating new category -->
    <b-modal id="create-modal" v-model="isCreateModalVisible" title="Create New Category" @ok="createCategory">
      <b-form-input v-model="newCategoryName" placeholder="Enter new category name"></b-form-input>
    </b-modal>

    <!-- Modal for editing categories -->
    <b-modal id="edit-modal" v-model="isEditModalVisible" title="Edit Category" @ok="saveCategory">
      <b-form-input v-if="editableCategory" v-model="editableCategory.name" placeholder="Enter category name"></b-form-input>
    </b-modal>

    <!-- Confirmation Modal for deleting categories -->
    <b-modal id="delete-modal" v-model="isDeleteModalVisible" title="Confirm Delete" @ok="deleteCategory" ok-title="Yes" ok-variant="danger">
      Are you sure you want to delete this category?
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';


interface Category {
  id: number;
  name: string;
}

export default defineComponent({
  components: {  },
  setup() {
    const categories = ref<Category[]>([]);
    const fields = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'edit', label: 'Edit', sortable: false },
      { key: 'delete', label: 'Delete', sortable: false }
    ];

    const isEditModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);
    const isCreateModalVisible = ref(false);
    const editableCategory = ref<Category | null>(null);
    const deletingCategoryId = ref<number | null>(null);
    const newCategoryName = ref('');

    const loadCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        categories.value = response.data;
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    onMounted(loadCategories);

    const showCreateModal = () => {
      isCreateModalVisible.value = true;
    };

    const createCategory = async () => {
      try {
        const response = await axios.post('/api/categories', { name: newCategoryName.value });
        categories.value.push(response.data);
        newCategoryName.value = '';  // Reset the input after successful creation
        isCreateModalVisible.value = false;
      } catch (error) {
        console.error("Failed to create category:", error);
        alert("Failed to create category. Please try again.");
      }
    };

    const editCategory = (category: Category) => {
      editableCategory.value = { ...category };
      isEditModalVisible.value = true;
    };

    const saveCategory = async () => {
      if (editableCategory.value) {
        try {
          const response = await axios.put(`/api/categories/${editableCategory.value.id}`, {
            name: editableCategory.value.name
          });
          const index = categories.value.findIndex(c => c.id === editableCategory.value.id);
          if (index !== -1) {
            categories.value[index] = response.data;
            isEditModalVisible.value = false;
          }
        } catch (error) {
          console.error("Failed to update category:", error);
          alert("Failed to update category. Please try again.");
        }
      }
    };

    const confirmDelete = (id: number) => {
      deletingCategoryId.value = id;
      isDeleteModalVisible.value = true;
    };

    const deleteCategory = async () => {
      if (deletingCategoryId.value !== null) {
        try {
          await axios.delete(`/api/categories/${deletingCategoryId.value}`);
          categories.value = categories.value.filter(c => c.id !== deletingCategoryId.value);
          isDeleteModalVisible.value = false;
        } catch (error) {
          console.error("Failed to delete category:", error);
          alert("Failed to delete category. Please try again.");
        }
      }
    };

    return {
      categories,
      fields,
      editCategory,
      saveCategory,
      confirmDelete,
      deleteCategory,
      isEditModalVisible,
      isDeleteModalVisible,
      isCreateModalVisible,
      editableCategory,
      deletingCategoryId,
      newCategoryName,
      showCreateModal,
      createCategory
    };
  },
});
</script>