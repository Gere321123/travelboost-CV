<template>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <nav v-if="isAuthChecked">
    <ul>
      <!-- Használj router-link-et saját stílusokkal -->
      <li><router-link to="/" class="custom-link" style="text-decoration: none; color: inherit;">Home</router-link></li>
      <li><router-link to="/all-inclusive" class="custom-link" style="text-decoration: none; color: inherit;">All inclusive</router-link></li>
      <li><router-link to="/last-minute" class="custom-link" style="text-decoration: none; color: inherit;">Last Minute</router-link></li>
      <li><router-link to="/destinations" class="custom-link" style="text-decoration: none; color: inherit;">Destinations</router-link></li>
      
      <!-- Példa a router-link használatára saját stílusokkal -->
      <li v-if="isLoggedIn && agencyId"><router-link :to="`/add-vacation/${agencyId}`" class="custom-link"><i class="glyphicon glyphicon-plus"></i> Add Vacation</router-link></li>
      <li v-if="isLoggedIn && agencyId"><router-link to="/agency-vacation" class="custom-link"><i class="glyphicon glyphicon-home"></i> Agency Vacation</router-link></li>
      
      <!-- Login és profile link router-link használatával és saját stílusokkal -->
      <li v-if="!isLoggedIn" class="login">
        <router-link to="/login" class="custom-link" style="text-decoration: none; color: inherit; margin-left: auto;">Login</router-link>
      </li>

      
      <li class="login" v-if="isLoggedIn">
  <router-link to="/profile" class="custom-link"><i class="glyphicon glyphicon-user"></i> Profile</router-link>
  <router-link v-if="haveAgency" to="/agency" class="custom-link" style="margin: 0 10px;"><i class="glyphicon glyphicon-briefcase"></i> My Agency</router-link>
  <button @click="logout" class="logout-button">Logout</button>
</li>

    </ul>
  </nav>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore';
import router from '@/router';
import { db } from '../firebase'

export default defineComponent({
  name: 'NavBar',
  setup() {
    const isAuthChecked = ref(false)
    const isLoggedIn = ref(false)
    const auth = getAuth()
    const haveAgency = ref(false)
    const agencyId = ref<string | null>(null)

    onMounted(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          isLoggedIn.value = true
          const userId = user.uid
          const userRef = doc(db, 'users', userId)
          const docSnap = await getDoc(userRef)
          if (docSnap.exists()) {
            const userData = docSnap.data()
            haveAgency.value = userData?.haveAgency || false
            agencyId.value = userData?.agencyId || null
          }
        } else {
          isLoggedIn.value = false
        }
        isAuthChecked.value = true
      })
    })

    const logout = () => {
      signOut(auth).then(() => {
        isLoggedIn.value = false
        router.push('/')
      }).catch((error) => {
        console.error("Error signing out: ", error)
      })
    }

    return {
      isLoggedIn,
      isAuthChecked,
      haveAgency,
      agencyId,
      logout
    }
  }
})
</script>


<style scoped>
nav {
  background-color: #ffa500; /* Light orange background */
  padding: 1em;
  box-shadow: 0 4px 11px rgba(0, 0, 0, 0.5); /* Strong shadow at the bottom */
  margin-bottom: 50px;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  align-items: center;
  margin: 0;
}

li {
  margin: 0 1em;
}

.custom-link {
  color: #333; /* Dark gray color for the links */
  text-decoration: none;
  font-weight: 700; /* Thicker font weight */
  position: relative;
  transition: color 0.3s ease; /* Smooth transition for color change */
}

.custom-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px; /* Thickness of the underline */
  display: block;
  background: #333; /* Dark gray underline */
  transition: width 0.3s ease; /* Smooth transition for underline */
  bottom: -2px; /* Position the underline slightly below the text */
  left: 0;
}

.custom-link:hover::after {
  width: 100%; /* Full width on hover */
}

.custom-link:hover {
  color: #555; /* Slightly lighter gray on hover */
}

.login {
  margin-left: auto;
  display: flex;
  align-items: center;
}

button.logout-button {
  background-color: #333; /* Dark gray background */
  color: white; /* White text */
  border: none;
  border-radius: 5px; /* Rounded corners */
  padding: 0.5em 1em;
  cursor: pointer;
  font-size: 0.9em;
  margin-left: 10px; /* Add margin between the button and links */
}

button.logout-button:hover {
  background-color: #555; /* Slightly lighter gray for hover effect */
}
</style>