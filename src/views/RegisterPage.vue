<template>
  <div class="register-container">
    <h1>Registration</h1>
    <form @submit.prevent="registerWithEmail">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" v-model="confirmPassword" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <button @click="registerWithGoogle">Register with Google</button>
    <p>Already have an account? Login <router-link class="link" to="/login">here</router-link></p>
  </div>
</template>

<script lang="ts">
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { defineComponent } from 'vue';
import User from '@/models/User';
import router from '@/router';
import { db } from '@/firebase'; // Import Firestore database
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions

export default defineComponent({
  name: 'RegisterPage',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    async registerWithEmail() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        const newUser = new User('', '', this.email, '', '', false);

        // Save newUser to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
          profilePictureUrl: newUser.profilePictureUrl,
          isGoogleUser: newUser.isGoogleUser,
          agency: newUser.agencyRequest,
          joinAgency: newUser.joinAgency
        });

        router.push('/'); // Redirect to the home page or desired route
      } catch (error) {
        console.error("Error during registration:", error);
      }
    },
    async registerWithGoogle() {
      try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const newUser = new User(user.displayName?.split(' ')[0] || '', user.displayName?.split(' ')[1] || '', user.email || '', user.phoneNumber || '', user.photoURL || '', true);

        // Save newUser to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
          profilePictureUrl: newUser.profilePictureUrl,
          isGoogleUser: newUser.isGoogleUser,
          agency: newUser.agencyRequest,
          joinAgency: newUser.joinAgency
        });
        router.push('/'); // Redirect to the home page or desired route
      } catch (error) {
        console.error("Google sign-in error:", error);
      }
    }
  }
})
</script>


<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}
a{
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
