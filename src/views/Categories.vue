<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Categories</h3>
    <b-table striped hover :items="categories" :fields="fields" class="w-full">
      <template #cell(edit)="data">
        <b-button variant="primary" @click="editCategory(data.item)">Edit</b-button>
      </template>
      <template #cell(delete)="data">
        <b-button variant="danger" @click="confirmDelete(data.item.id)">Delete</b-button>
      </template>
    </b-table>
    <!-- Modal for editing categories -->
    <b-modal id="edit-modal" v-model="isEditModalVisible" title="Edit Category" @ok="saveCategory">
      <b-form-input
          v-if="editableCategory"
          v-model="editableCategory.name"
          placeholder="Enter category name">
      </b-form-input>
    </b-modal>

    <!-- Confirmation Modal for deleting categories -->
    <b-modal id="delete-modal"
             v-model="isDeleteModalVisible"
             title="Confirm Delete"
             @ok="deleteCategory"
             ok-title="Yes"
             ok-variant="danger">
      Are you sure you want to delete this category?
    </b-modal>
  </div>
  <footer_component></footer_component>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import Footer_component from "@/components/footer_component.vue";

interface Category {
  id: number;
  name: string;
}

export default defineComponent({
  components: {Footer_component},
  setup() {
    const categories = ref<Category[]>([
      {id: 1, name: "Electronics"},
      {id: 2, name: "Furniture"},
      {id: 3, name: "Clothing"}
    ]);

    const fields = [
      {key: 'id', label: 'ID'},
      {key: 'name', label: 'Name'},
      {key: 'edit', label: 'Edit', sortable: false},
      {key: 'delete', label: 'Delete', sortable: false}
    ];

    const isEditModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);
    const editableCategory = ref<Category | null>(null);
    const deletingCategoryId = ref<number | null>(null);

    const editCategory = (category: Category) => {
      editableCategory.value = {...category};
      isEditModalVisible.value = true;
    };

    const saveCategory = () => {
      if (editableCategory.value) {
        const index = categories.value.findIndex(c => c.id === editableCategory.value.id);
        if (index !== -1) {
          categories.value[index] = {...editableCategory.value};
          isEditModalVisible.value = false;
        }
      }
    };

    const confirmDelete = (id: number) => {
      deletingCategoryId.value = id;
      isDeleteModalVisible.value = true;
    };

    const deleteCategory = () => {
      if (deletingCategoryId.value !== null) {
        categories.value = categories.value.filter(c => c.id !== deletingCategoryId.value);
        isDeleteModalVisible.value = false;
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
      editableCategory,
      deletingCategoryId
    }
  },
})
</script>
