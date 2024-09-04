<template>
  <div class="agency-details-section">
    <div  v-if="agency">
    <h1>{{ agency.name }}</h1>
    <ul class="agency-details-list">
      <li><strong>Address:</strong> {{ agency.address }}</li>
      <li><strong>Phone Number:</strong> {{ agency.phoneNumber }}</li>
      <li><strong>Email:</strong> {{ agency.email }}</li>
      <li><strong>Website:</strong> <a :href="agency.website" target="_blank">{{ agency.website }}</a></li>
      <li v-if="agency.employees.length !== 0"><strong>Employees:</strong>
        <ul>
          <li v-for="employee in agency.employees" :key="employee">{{ employee }}</li>
        </ul>
      </li>
    </ul>
    <div v-if="agency.profilePictureUrl" class="profile-picture">
      <img :src="agency.profilePictureUrl" alt="Profile Picture" />
    </div>
  </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/firebase'; // Make sure to configure your Firebase instance
import { doc, getDoc } from 'firebase/firestore';
import { Agency } from '@/models/Agency';

export default defineComponent({
  name: 'AgencyDetailsComponent',
  props: {
    agencyId: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const agency = ref<Agency | null>(null);

    onMounted(async () => {
      const { agencyId } = props;

      if (agencyId) {
        try {
          const docRef = doc(db, 'agencies', agencyId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            agency.value = docSnap.data() as Agency;
          }
        } catch (error) {
          console.error('Error fetching agency data:', error);
        }
      } 
    });

    return {
      agency,
    };
  },
});
</script>


  
  <style scoped>
  .agency-details-section {
    width: 400px;
    height: auto;
    background-color: #f5f5f5; /* Light gray background */
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Slight shadow */
    border-radius: 10px; /* Rounded corners */
    max-width: 800px; /* Make the section wider */
    margin: auto; /* Center the section */
  }
  
  .agency-details-list {
    list-style-type: none;
    padding: 0;
  }
  
  .profile-picture img {
    max-width: 100%;
    border-radius: 10px;
    margin-top: 20px;
  }
  </style>
  