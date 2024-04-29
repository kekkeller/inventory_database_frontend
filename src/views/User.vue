<template>
    <div class="mx-auto my-10" style="width: 90%">
        <h3 class="text-left">User List</h3>
        <b-table striped hover :items="accounts" :fields="fields"></b-table>
        <footer_component></footer_component>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { userAccounts } from '@/composable/userAccounts'
import Footer_component from '@/components/footer_component.vue'

export default defineComponent({
    components: { Footer_component },
    setup() {
        const { accounts } = userAccounts()
        const fields = [
            { key: 'email', label: 'Email' },
            { key: 'isAdmin', label: 'Is Admin' },
        ]

        return {
            accounts,
            fields,
        }
    },
})
</script>
<style></style>
