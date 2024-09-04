<template>
  <div class="agency-vacations-page">
    <h1>My Agency's Vacations</h1>
    <div class="vacation-cards">
      <VakacionCard v-for="vacation in filteredVacations" :key="vacation.id" :vacation="vacation" :to="`/add-vacation/${agencyId}/${vacation.id}`" />
    </div>
    <div v-if="filteredVacations.length === 0">
      <p>No vacations found for your agency.</p>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import VakacionCard from '@/components/VakacionCard.vue';
import { getFirestore, collection, getDoc, doc,getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth'

interface Vacation {
  id: string;
  arrivalCountry: string;
  price: number;
  images: { name: string; url: string }[];
  agencyId: string;
}

export default defineComponent({
  name: 'AgencyVacationsPage',
  components: {
    VakacionCard,
  },
  setup() {
    const vacations = ref<Vacation[]>([]);
    const db = getFirestore();
    const auth = getAuth()
    const agencyId = ref<string | null>(null)


    const fetchVacations = async () => {
      const querySnapshot = await getDocs(collection(db, 'vacations'));
      vacations.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        arrivalCountry: doc.data().arrivalCountry,
        price: doc.data().price,
        images: doc.data().images.map((image: any) => ({
          name: image.name,
          url: image.url,
        })),
        agencyId: doc.data().agencyId,
      })) as Vacation[];
    };

    const filteredVacations = computed(() => {

      return vacations.value.filter(vacation => vacation.agencyId === agencyId.value);
    });

    onMounted(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid
          const userRef = doc(db, 'users', userId)
          const docSnap = await getDoc(userRef)
          if (docSnap.exists()) {
            const userData = docSnap.data()
            agencyId.value = userData?.agencyId || null
          }
        }
      }),
      fetchVacations();
    });

    return { filteredVacations, agencyId };
  },
});
</script>


<style scoped>
.agency-vacations-page {
  padding: 20px;
}

.vacation-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.vacation-card {
  margin-bottom: 20px;
}
</style>
