<template>
    <div class="booking-container">
      <h1>Book Your Stay</h1>
      <form @submit.prevent="submitBooking">
        <div class="form-group" v-for="(booking, index) in bookings" :key="index">
          <h2>Guest {{ index + 1 }}</h2>
          <label for="firstName">First Name:</label>
          <input
            type="text"
            v-model="booking.firstName"
            required
          />
  
          <label for="lastName">Last Name:</label>
          <input
            type="text"
            v-model="booking.lastName"
            required
          />
  
          <label for="email">Email:</label>
          <input
            type="email"
            v-model="booking.email"
            required
          />
  
          <label for="phone">Phone Number:</label>
          <input
            type="tel"
            v-model="booking.phone"
            required
          />
  
          <label for="bookingDate">Date of birth:</label>
          <input
            type="date"
            v-model="booking.bookingDate"
            required
          />
  
          <button v-if="this.bookings.length > 1" @click="removeGuest(index)">Remove Guest</button>
        </div>
  
        <button @click="addGuest">Add Another Guest</button>
        <button type="submit">Book Now</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        bookings: [
          {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            bookingDate: ''
          }
        ]
      };
    },
    methods: {
      addGuest() {
        this.bookings.push({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          bookingDate: ''
        });
      },
      removeGuest(index) {
        if (this.bookings.length > 1) {
          this.bookings.splice(index, 1);
        } else {
          alert('You must have at least one guest.');
        }
      },
      submitBooking() {
        const valid = this.bookings.every(booking => 
          booking.firstName && booking.lastName && booking.email && booking.phone && booking.bookingDate
        );
        
        if (valid) {
          console.log('Bookings:', this.bookings);
          alert('Booking confirmed!');
          // Here you can handle the booking submission, e.g., send to a server
        } else {
          alert('Please fill out all fields for all guests.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .booking-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  h2 {
    margin-top: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="date"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  