<template>
  <div v-if="vacation" class="vacation-page">
    <div class="main-content">
      <AboutTheAgency :agencyId="vacation.agencyId" />
      <!-- Image Slideshow Component -->
      <ImageSlideshow :images="vacation.images" class="imageSlideshow" />
      <!-- Details Component -->
      <DetailsComponent :vacation="vacation" />
    </div>
    <!-- Description and Documents -->
    <div class="additional-info">
      <p v-html="vacation.description"></p>
      <p v-html="vacation.documents"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import ImageSlideshow from '../components/ImageSlideshow.vue';
import DetailsComponent from '../components/DetailsComponent.vue';
import AboutTheAgency from '../components/AboutTheAgency.vue';
import { Vacation } from '@/models/Vacation'; 

export default defineComponent({
  name: 'VakacionPage',
  components: {
    ImageSlideshow,
    DetailsComponent,
    AboutTheAgency,
  },
  data() {
    return {
      vacation: null as Vacation | null,
    };
  },
  async mounted() {
    const route = useRoute();
    const db = getFirestore();
    const docRef = doc(db, 'vacations', route.params.id as string);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.vacation = docSnap.data() as Vacation;
    }
  },
});
</script>

<style scoped>
.vacation-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: auto;
}

.imageSlideshow {
  margin: 30px;
}

.main-content {
  display: flex;
}

.additional-info {
  width: 100%;
  margin-top: 20px;
}
</style>
