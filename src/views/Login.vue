<template>
  <div class="pt-12 text-center">
    <LoginComponent>
    </LoginComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LoginComponent from "@/components/login_component.vue";



export default defineComponent({
  components: {LoginComponent},
  setup() {

    return {
    }
  },
})
</script>
