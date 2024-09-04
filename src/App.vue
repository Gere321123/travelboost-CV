<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from './components/NavBar.vue'

export default defineComponent({
  name: 'App',
  components: {
    NavBar
  }
})
</script>

<style>
  .ProseMirror{
    padding:  2px 8px
    }
    .app {
  background-color: #f0f0f0; /* Light gray background */
  min-height: 100vh; /* Ensure the app takes at least the full viewport height */
  padding: 16px; /* Some padding for overall layout */
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 12px; /* Width of the scrollbar */
}

::-webkit-scrollbar-track {
  background: #f0f0f0; /* Background of the scrollbar track */
}

::-webkit-scrollbar-thumb {
  background-color: #ffa500; /* Orange color for the scrollbar thumb */
  border-radius: 6px; /* Rounded corners for the scrollbar thumb */
  border: 3px solid #f0f0f0; /* Padding around the scrollbar thumb */
}
</style>
