<template>
  <div class="mx-auto my-10" style="width: 90%;">
    <h3 class="text-left">My Bookings</h3>
    <h1 class="text-2xl mb-8"></h1>
    <b-table striped hover :items="rentals" class="w-full"></b-table>
    <div class="flex justify-end mt-4">
      <BaseLabel>
        Total spendings: {{totalPrice}}
      </BaseLabel>
    </div>
  </div>
  <footer_component>

  </footer_component>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import {BaseLabel, BaseTable } from "@apiida/vue-components";
import Footer_component from "@/components/footer_component.vue";

interface Rental {
  Date: string;
  Device: string;
  Active: boolean;
  StartTime: string;
  EndTime: string;
  Price: string;
}

export default defineComponent({
  components: {
    Footer_component,
    BaseTable,
    BaseLabel,
  },
  setup() {
    const rentals: Rental[] = [
      {
        Date: '2024-04-03',
        Device: 'iPhone 12',
        Active: true,
        StartTime: '10:00 AM',
        EndTime: '04:00 PM',
        Price: '$19.99'
      },
      {
        Date: '2024-04-04',
        Device: 'MacBook Pro 16"',
        Active: true,
        StartTime: '09:00 AM',
        EndTime: '05:00 PM',
        Price: '$29.99'
      },
      {
        Date: '2024-04-05',
        Device: 'iPhone 13 Pro',
        Active: false,
        StartTime: '11:00 AM',
        EndTime: '03:00 PM',
        Price: '$21.99'
      }
    ];

    function calculateTotalPrice(rentals: Rental[]): string {
      const total = rentals.reduce((total, rental) => {
        const price = parseFloat(rental.Price.substring(1));
        return total + price;
      }, 0);

      return `$${total.toFixed(2)}`;
    }

    const totalPrice = calculateTotalPrice(rentals);

    return {
      rentals,
      totalPrice,
    }
  },
})
</script>
