<template>
  <div class="home-page">
    <h1>Home Page</h1>
    <div class="vacation-cards">
      <VakacionCard v-for="vacation in vacations" :key="vacation.id" :vacation="vacation"  :to="'/vacation/' + vacation.id" />
    </div>
    <div v-if="vacations.length === 0">
      <p>Loading vacations...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import VakacionCard from '@/components/VakacionCard.vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface Vacation {
  id: string;
  arrivalCountry: string;
  price: number;
  images: { name: string; url: string }[];
}

export default defineComponent({
  name: 'HomePage',
  components: {
    VakacionCard,
  },
  setup() {
    const vacations = ref<Vacation[]>([]);
    const db = getFirestore();

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
      })) as Vacation[];
    };

    onMounted(() => {
      fetchVacations();
    });

    return { vacations };
  },
});
</script>

<style scoped>
.home-page {
  padding: 20px;
}

.vacation-cards {
  display: flex;
  flex-wrap: wrap; /* Ensure items wrap to the next line if needed */
  gap: 20px; /* Adjust the gap between items */
}

/* Optional: Adjust styles for individual VakacionCard components */
.vacation-card {
  margin-bottom: 20px;
}
</style>