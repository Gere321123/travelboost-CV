<template>
  <div v-if="isLoad" class="profile-container">
    <h1>Profile</h1>
    <div class="profile-picture-container">
      <img :src="user.profilePictureUrl || 'https://firebasestorage.googleapis.com/v0/b/travel-boost-ae3ad.appspot.com/o/profile_pictures%2Fno-image.png?alt=media&token=515df5d2-bbd5-44d6-ae66-bb3b8988d87f'" alt="Profile Picture" class="profile-picture" />
    </div>
    <form @submit.prevent="saveProfile">
      <div class="form-group">
        <label for="firstName">First Name:</label>
        <input type="text" v-model="user.firstName" />
      </div>
      <div class="form-group">
        <label for="lastName">Last Name:</label>
        <input type="text" v-model="user.lastName" />
      </div>
      <div class="form-group">
        <label for="profilePicture">Profile Picture:</label>
        <input type="file" @change="onFileChange" />
      </div>
      <div class="form-group">
        <label for="phone">Phone Number:</label>
        <input type="tel" v-model="user.phone" />
      </div>
      <div class="form-group" v-if="!user.isGoogleUser">
        <label for="password">Password:</label>
        <input type="password" v-model="password" />
      </div>
      <div class="form-group" v-if="!user.isGoogleUser">
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" v-model="confirmPassword" />
      </div>
      <button type="submit">Save Profile</button>
    </form>
    <!-- <button v-if="!user.agencyRequest && !user.joinAgency" @click="requestAgency" class="agency-button">Join agency as an employee</button> -->
    <button v-if="!user.agencyRequest && !user.joinAgency" @click="createAgency" class="agency-button">Create your agency</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { db } from '../firebase';
import { getAuth, updatePassword, updateProfile, onAuthStateChanged  } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import User from '@/models/User';
import router from '@/router';

import { doc, getDoc } from 'firebase/firestore';

export default defineComponent({
  name: 'ProfilePage',
  data() {
    return {
      user: new User('', '', '', '', '', false),
      password: '',
      confirmPassword: '',
      profilePictureFile: null as File | null,
      isLoad: false,
    };
  },
  methods: {
    onFileChange(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.profilePictureFile = target.files[0];
      }
    },
    async saveProfile() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        if (this.profilePictureFile) {
          const storage = getStorage();
          const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
          await uploadBytes(storageRef, this.profilePictureFile);
          this.user.profilePictureUrl = await getDownloadURL(storageRef);
        }

        await updateProfile(currentUser, {
          displayName: `${this.user.firstName} ${this.user.lastName}`,
          photoURL: this.user.profilePictureUrl || null,
        });

        if (!this.user.isGoogleUser && this.password) {
          updatePassword(currentUser, this.password).catch((error) => {
            console.error("Error updating password:", error);
          });
        }

        alert("Profile updated successfully.");
      }
    },
    requestAgency() {
     router.push("/join-agency");
    },
    createAgency(){
      router.push('/create-agency');
    }
  },
  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const names = user.displayName ? user.displayName.split(' ') : ['', ''];
        this.user.firstName = names[0];
        this.user.lastName = names[1];
        this.user.email = user.email || '';
        this.user.phone = user.phoneNumber || '';
        this.user.profilePictureUrl = user.photoURL || '';
        this.user.isGoogleUser = user.providerData.some((provider) => provider.providerId === 'google.com');
        const userId = user.uid;
        const userRef = doc(db, 'users', userId);
        getDoc(userRef).then((doc) => {
          this.isLoad = true;
          if (doc.exists()) {
            const userData = doc.data();
            this.user.agencyRequest = userData?.agencyRequest || false;
            this.user.joinAgency = userData?.joinAgency || false;
          }
        });
      }
    });
  },
});
</script>


<style scoped>
.profile-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.profile-picture-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: calc(100% - 10px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #ffa500;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #f3b543;
}

.agency-button {
  margin-top: 10px;
  background-color: #28a745;
}

.agency-button:hover {
  background-color: #218838;
}
</style>
