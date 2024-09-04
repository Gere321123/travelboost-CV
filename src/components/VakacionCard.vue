<template>
  <router-link :to="to" class="vacation-card-container" :class="{ 'hovered': isHover }">
    <div class="vacation-card" @mouseover="isHover = true" @mouseleave="isHover = false">
      <div class="vacation-image-container">
        <img v-if="vacation.images.length > 0" :src="vacation.images[0].url" alt="Vacation Image" class="vacation-image" />
      </div>
      <div class="vacation-info">
        <h3>{{ vacation.arrivalCountry }}</h3>
        <div class="vacation-price">{{ vacation.price }}$/person</div>
      </div>
    </div>
  </router-link>
</template>
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  interface Vacation {
    id: string;
    arrivalCountry: string;
    price: number;
    images: { name: string; url: string }[];
  }
  
  export default defineComponent({
    name: 'VakacionCard',
    props: {
      vacation: {
        type: Object as PropType<Vacation>,
        required: true,
      },
      to: {
      type: String as PropType<string>,
      required: true
    }
    },
    data() {
      return {
        isHover: false
      };
    }
  });
  </script>
  
  <style scoped>
  .vacation-card-container {
    border: 2px solid #333; /* Dark border around the entire card */
    border-radius: 12px; /* Rounded corners */
    overflow: hidden;
    text-decoration: none; /* Remove underline from link */
    color: inherit; /* Inherit text color */
  }
  
  .vacation-card {
    width: 300px; /* Full width inside the container */
    height: 200px; /* Full height inside the container */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px; /* Rounded corners */
    overflow: hidden;
    transition: opacity 0.3s ease; /* Smooth transition for opacity */
  }
  
  .vacation-card:hover {
    opacity: 0.8; /* Dim the card on hover */
  }
  
  .vacation-image-container {
    position: relative;
    width: 100%;
    height: 70%; /* Adjust image height */
    overflow: hidden;
  }
  
  .vacation-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensure the image covers the entire container */
  }
  
  .vacation-info {
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.8); /* Dark background with transparency */
  }
  
  .vacation-info h3 {
    margin: 0;
    font-weight: bold; /* Bold font weight */
    font-size: 1.5rem; /* Adjust size as needed */
    color: #fff; /* White text color */
  }
  
  .vacation-price {
    padding: 5px; /* Padding around the price */
    text-align: right;
    color: #fff; /* White text color */
  }
  </style>