<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="loginWithEmail">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      
      
      <button type="submit">Login</button>
    </form>
    <button id="google-login-btn" @click="loginWithGoogle">Login with Google</button>
    <p>Don't have an account jet? Click here <router-link class="link" to="/register">Registration</router-link></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import router from '@/router';
import { doc, setDoc, getFirestore, getDoc, } from "firebase/firestore";
import User from '@/models/User';

export default defineComponent({
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    loginWithEmail() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user;
         router.push('/');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Error logging in with email:', errorCode, errorMessage);
        });
    },
    async loginWithGoogle() {
      try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if the user already exists in Firestore
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          // Create a new User object
          const newUser: User = {
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ')[1] || '',
            email: user.email || '',
            phone: user.phoneNumber || '',
            profilePictureUrl: user.photoURL || '',
            isGoogleUser: true,
            agencyRequest: false,
            haveAgency: false,
            joinAgency: false,
            agencyId: '',
          };

          // Save newUser to Firestore
          await setDoc(userRef, newUser);
        }

        router.push('/'); // Redirect to the home page or desired route
      } catch (error) {
        console.error("Google sign-in error:", error);
      }
    }
  
}
})
</script>
<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.link{
  color: #0056b3;
}
form div {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.5em;
  border: none;
  border-radius: 4px;
  background-color: #ffa500;
  color: rgb(0, 0, 0);
  cursor: pointer;
  margin: 5px;
}

button:hover {
  background-color: #f3b543;
}

button + button {
  margin-top: 0.5em;
}

router-link {
  display: block;
  text-align: center;
  margin-top: 1em;
  color: #007bff;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}
</style>