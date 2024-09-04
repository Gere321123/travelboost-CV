<template>
  <div class="details-section">
    <h1>{{ vacation.arrivalCountry }}</h1>
    <ul class="details-list">
      <li><strong>Arrival Location:</strong> {{ vacation.arrivalLocation }}</li>
      <li><strong>Departure Location:</strong> {{ vacation.departureLocation }}</li>
      <li><strong>Price:</strong> {{ vacation.price }}</li>
      <li><strong>Start Date:</strong> {{ vacation.startDate }}</li>
      <li><strong>End Date:</strong> {{ vacation.endDate }}</li>
      <!-- Add more fields as needed -->
    </ul>
    <!-- Buttons -->
    <div class="buttons">
      <button @click="handleCheck">Book</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import router from '@/router';
import { Vacation } from '@/models/Vacation'; 

export default defineComponent({
  name: 'DetailsComponent',
  props: {
    vacation: {
      type: Object as PropType<Vacation>,
      required: true,
    },
  },
  methods: {
    handleCheck() {
      router.push('/book');
    },
  }
});
</script>

<style scoped>
.details-section {
  width: 400px;
  height: 300px;
  background-color: #f5f5f5; /* Light gray background */
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Slight shadow */
  border-radius: 10px; /* Rounded corners */
  max-width: 800px; /* Make the section wider */
  margin: auto; /* Center the section */
}

.details-list {
  list-style-type: none;
  padding: 0;
}

.buttons {
  display: flex;
  justify-content: space-between; /* Space out the buttons */
  margin-top: 20px;
}

button {
  flex: 1; /* Make buttons take equal space */
  margin: 0 5px; /* Add spacing between buttons */
  padding: 10px 20px;
  background-color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s; /* Smooth transition */
}

button:hover {
  background-color: #dddddd;
}
</style>
