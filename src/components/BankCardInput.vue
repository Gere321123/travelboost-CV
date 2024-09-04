<template>
  <div>
    <label>Bank Card Details:</label>
    <input 
      type="text" 
      :value="cardNumber" 
      @input="$emit('update:cardNumber', $event.target.value)" 
      placeholder="Card Number" 
      required
    >
    <input 
      type="text" 
      :value="cardExpiry" 
      @input="$emit('update:cardExpiry', $event.target.value)" 
      placeholder="Expiry Date (MM/YY)" 
      required
    >
   
  </div>
</template>

<script>
export default {
  name: 'BankCardInput',
  props: {
    cardNumber: String,
    cardExpiry: String,
    cardCVC: String
  }
};
</script>

<style scoped>
input {
  display: block;
  margin-bottom: 12px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
</style>
