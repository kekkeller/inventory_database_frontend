<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">Categories</h3>

    <div class="flex justify mt-4">
    </div>
  </div>
  <footer_component></footer_component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Footer_component from "@/components/footer_component.vue";

export default defineComponent({
  components: {
    Footer_component,
  },
  setup() {

    return {
    }
  },
})
</script>
