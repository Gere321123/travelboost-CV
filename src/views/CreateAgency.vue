<template>
  <div class="create-agency">
    <h1>Create Agency</h1>

    <form @submit.prevent="submitForm" class="agency-form">
      <label>Agency Name:</label>
      <input type="text" v-model="agencyName" required />

      <label>Website:</label>
      <input type="text" v-model="website" />

      <label>Phone Number:</label>
      <input type="tel" v-model="phoneNumber" required />

      <label>Address (Google Maps link):</label>
      <input type="text" v-model="address" required />


      <BankCardInput
        v-model:cardNumber="bankCardNumber"
        v-model:cardExpiry="bankCardExpiry"
        v-model:cardCVC="bankCardCVC"
      />

      <label for="profilePicture">Profile Picture:</label>
      <input type="file" @change="onFileChange" />

      <label>
        <input type="checkbox" v-model="termsAccepted" required />
        I have read and agree to the terms and conditions.
      </label>
      <div class="line">
        Click <a @click.prevent="isPopUp = true">here</a> to read it.
      </div>
      <PopUp v-if="isPopUp" :TogglePopup="togglePopup">
        Valamiaasdasd asd asd asda sddasd h hdfg sd fsdf sd sd fsdf sd fsdf sdgdfg df gdfg df ggsdriufh asiuhdf ishufiu hdsifh ksjdhf ksjhedf kljdsh flkjhlkUJS FH
      </PopUp>

      <PopUp v-if="ifCreate" :TogglePopup="createAgency">
        Sikeresen regisztrálta az ügynökségét nálunk pár napon belül már használhatya is az oldalunkat <br />
        Visszafogunk jelezni, hogy mizu.
      </PopUp>

      <button type="submit">Create Agency</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import BankCardInput from '../components/BankCardInput.vue';
import PopUp from '../components/PopUp.vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import router from '@/router';
import axios from 'axios';

export default defineComponent({
  name: 'CreateAgency',
  components: {
    BankCardInput,
    PopUp,
  },
  setup() {
    const isPopUp = ref(false);
    const ifCreate = ref(false);
    const agencyName = ref('');
    const website = ref('');
    const phoneNumber = ref('');
    const address = ref('');
    const bankCardNumber = ref('');
    const bankCardExpiry = ref('');
    const bankCardCVC = ref('');
    const paypalEmail = ref('');
    const profilePictureUrl = ref('');
    const termsAccepted = ref(false);
    let profilePictureFile: File | null = null;
    const userEmail = ref('');
    const userId = ref('');

    const sendJoinRequestEmail = async () => {
      try {
        const response = await axios.post('http://localhost:3000/sendtravelboost', {
          userEmail: userEmail.value,
          agencyName: agencyName.value
        });
      } catch (error) {
        console.error('Error sending notification email:', error);
      }
    };

    const submitForm = async () => {
      if (!termsAccepted.value) {
        alert('Please accept the terms and conditions.');
        return;
      }

      try {
        // Upload the profile picture if it exists
        if (profilePictureFile) {
          const storage = getStorage();
          const storageReference = storageRef(storage, `profile_pictures/${profilePictureFile.name}`);
          await uploadBytes(storageReference, profilePictureFile);
          profilePictureUrl.value = await getDownloadURL(storageReference);
        }


        const agencyData = {
          isActive: false,
          name: agencyName.value,
          email: userEmail.value,
          website: website.value,
          phoneNumber: phoneNumber.value,
          address: address.value,
          bankCardDetails: {
            number: bankCardNumber.value,
            expiry: bankCardExpiry.value,
            cvc: bankCardCVC.value,
          },
          employees: [],
          paypalEmail: paypalEmail.value,
          profilePictureUrl: profilePictureUrl.value,
        };

        const docRef = await addDoc(collection(db, 'agencies'), agencyData);

        if (userId.value) {
          const userRef = doc(db, 'users', userId.value);
          await updateDoc(userRef, {
            agencyRequest: true,
            agencyId: docRef.id,
          });
        }
        ifCreate.value = true;
        await sendJoinRequestEmail();

      } catch (error) {
        console.error('Error adding agency: ', error);
      }
    };

    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        profilePictureFile = target.files[0];
      }
    };

    return {
      agencyName,
      website,
      phoneNumber,
      address,
      bankCardNumber,
      bankCardExpiry,
      bankCardCVC,
      paypalEmail,
      profilePictureUrl,
      termsAccepted,
      userEmail,
      userId,
      isPopUp,
      ifCreate,
      submitForm,
      onFileChange,
    };
  },
  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        this.userEmail = user.email;
        this.userId = user.uid;
      }
    });
  },
  methods: {
    togglePopup() {
      this.isPopUp = !this.isPopUp;
    },
    createAgency() {
      router.push('/profile');
    }
  },
});
</script>


  <style scoped>
  .create-agency {
    max-width: 600px;
    margin: auto;
    padding: 20px;
  }
  
  .agency-form {
    display: flex;
    flex-direction: column;
  }
  
  .agency-form label {
    margin-bottom: 8px;
  }
  
  .agency-form input[type="text"],
  .agency-form input[type="tel"],
  .agency-form input[type="checkbox"] {
    padding: 8px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .agency-form button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .agency-form button:hover {
    background-color: #0056b3;
  }
  
  .ImageUploader {
    margin-bottom: 12px;
  }
  </style>
  