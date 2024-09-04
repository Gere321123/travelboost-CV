<template>
    <div class="add-vakacion-container">
      <h1>{{ isNewVakacion ? 'Add Vakacion' : 'Edit Vakacion' }}</h1>
      <form @submit.prevent="submitVakacion">
        <div>
          <label for="arrivalLocation">Price / Person:</label>
          <input type="number" v-model="vakacion.price" id="price"  min="0"/>
        </div>
        <div>
          <label for="arrivalLocation">Max Person in this vakacion:</label>
          <input type="number" v-model="vakacion.maxPerson" id="maxPerson"  min="0"/>
        </div>
        <div>
          <label for="transportation">Transportation:</label>
          <input type="checkbox" v-model="vakacion.transportation" id="transportation" />
        </div>
        
        <div v-if="vakacion.transportation">
          <label for="departureLocation">Departure Location:</label>
          <input type="text" v-model="vakacion.departureLocation" id="departureLocation" />
        </div>
        
        <div v-if="vakacion.transportation">
          <label for="transportMode">Transportation Mode:</label>
          <div>
            <label>
              <input type="checkbox" v-model="vakacion.transportMode.airplane" />
              Airplane
            </label>
            <label>
              <input type="checkbox" v-model="vakacion.transportMode.bus" />
              Bus
            </label>
          </div>
        </div>
        
        <div>
          <label for="startDate">Start Date:</label>
          <input type="date" v-model="vakacion.startDate" id="startDate"  />
        </div>
        
        <div>
          <label for="endDate">End Date:</label>
          <input type="date" v-model="vakacion.endDate" id="endDate"  />
        </div>
        <div>
          <label for="arrivalLocation">Web link:</label>
          <input type="text" v-model="vakacion.weblink" id="weblink"  />
        </div>
        <div>
          <label for="arrivalLocation">Arrival Country:</label>
          <input type="text" v-model="vakacion.arrivalCountry" id="arrivalCountry"  />
        </div>
        <div>
          <label for="arrivalLocation">Arrival City:</label>
          <input type="text" v-model="vakacion.arrivalLocation" id="arrivalLocation"  />
        </div>

        <div>
          <label for="arrivalLocation">Hotel:</label>
          <input type="text" v-model="vakacion.hotel" id="hotel"  />
        </div>
        <div class="star-rating">
      <label for="starRating">Hotel Star Rating:</label>
      <div class="stars">
        <label v-for="star in 5" :key="star" class="star" :class="{ 'star-selected': star <= vakacion.stars }">
          <input type="radio" v-model="vakacion.stars" :value="star" id="starRating" />
          ★
        </label>
          </div>
        </div>


        <div>
          <div v-if="vakacion.food">
          <label for="transportation">Food (all include)</label>
          <input type="checkbox" v-model="vakacion.food" id="food" />
          </div>
          <div v-if="!vakacion.food">
          <label for="transportation">Breakfast:</label>
          <input type="checkbox" v-model="vakacion.breakfast" id="breakfast" />
          <label for="transportation">Lunch:</label>
          <input type="checkbox" v-model="vakacion.lunch" id="lunch" />
          <label for="transportation">Dinner:</label>
          <input type="checkbox" v-model="vakacion.dinner" id="dinner" />
        </div>
        </div>
          <!-- További checkboxok kategóriákhoz -->
         
        <div>
      <h3>Activities:</h3>
      <label class="checkbox-inline">
        <input type="checkbox" v-model="vakacion.seaside" id="seaside" /> Seaside
      </label>
      <label class="checkbox-inline">
        <input type="checkbox" v-model="vakacion.mountains" id="seaside" /> Mountains
      </label>
      <label class="checkbox-inline">
        <input type="checkbox" v-model="vakacion.sightseeing" id="sightseeing" /> Sightseeing
      </label>
      <label class="checkbox-inline">
        <input type="checkbox" v-model="vakacion.extreme" id="extreme" /> Extreme Sports
      </label>
       </div>

       <div>
  <h3>For whom:</h3>
    <label class="checkbox-inline">
      <input type="checkbox" v-model="vakacion.family" id="family" /> Family
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" v-model="vakacion.young" id="young" /> Youth
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" v-model="vakacion.elderly" id="elderly" /> Elderly
    </label>
</div>

      <div>
        <h3>Description about the vakacion:</h3>
        <text-editor v-model="vakacion.description" />
      </div>
        
      <h3>Required Documents:</h3>
      <text-editor v-model="vakacion.documents" />


      <image-uploder :initialImages="vakacion.images" @update:images="vakacion.images = $event"/>

        
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import TextEditor from '../components/TextEditor.vue';
  import ImageUploder from '../components/ImageUploder.vue';
  import { db } from '../firebase';
  import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
  
  interface Vakacion {
    transportation: boolean;
    departureLocation: string;
    transportMode: {
      airplane: boolean;
      bus: boolean;
    };
    startDate: string;
    endDate: string;
    arrivalLocation: string;
    description: string;
    documents: string;
    hotel: string;
    arrivalCountry: string;
    price: number;
    stars: number;
    food: boolean;
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    images: { name: string; url: string }[];
    seaside: boolean;
    mountains: boolean;
    sightseeing: boolean;
    extreme: boolean;
    family: boolean;
    young: boolean;
    elderly: boolean;
    maxPerson: number;
    agencyId: string;
    weblink: string;
  }
  
  export default defineComponent({
    name: 'AddVakacion',
    components: {
      TextEditor,
      ImageUploder,
    },
    setup() {
      const vakacion = ref<Vakacion>({
        transportation: false,
        departureLocation: '',
        transportMode: {
          airplane: true,
          bus: false,
        },
        startDate: '',
        endDate: '',
        arrivalLocation: '',
        description: '',
        documents: '',
        hotel: '',
        arrivalCountry: '',
        price: 0,
        stars: 0,
        food: true,
        breakfast: false,
        lunch: false,
        dinner: false,
        images: [],
        seaside: false,
        mountains: false,
        sightseeing: false,
        extreme: false,
        family: false,
        young: false,
        elderly: false,
        maxPerson: 0,
        agencyId: '',
        weblink: '',
      });
  
      const isNewVakacion = ref(true);
      const route = useRoute();
      const vakacionId = ref<string | undefined>(undefined);
      const agencyId = ref<string | undefined>(undefined);
  
      onMounted(() => {
        agencyId.value = route.params.agencyId as string | undefined;
        vakacionId.value = route.params.id as string | undefined;
  
        if (agencyId.value) {
          vakacion.value.agencyId = agencyId.value;
        }
  
        if (vakacionId.value) {
          isNewVakacion.value = false;
          fetchVakacion(vakacionId.value);
        }
      });
  
      watch(() => route.params, (newParams) => {
        agencyId.value = newParams.agencyId as string | undefined;
        vakacionId.value = newParams.id as string | undefined;
  
        if (agencyId.value) {
          vakacion.value.agencyId = agencyId.value;
        }
  
        if (vakacionId.value) {
          isNewVakacion.value = false;
          fetchVakacion(vakacionId.value);
        } else {
          resetForm();
        }
      });
  
      const fetchVakacion = async (id: string) => {
        try {
          const vakacionRef = doc(db, 'vacations', id);
          const vakacionDoc = await getDoc(vakacionRef);
          if (vakacionDoc.exists()) {
            vakacion.value = vakacionDoc.data() as Vakacion;
          } else {
            console.error('Vakacion not found!');
          }
        } catch (error) {
          console.error('Error fetching document: ', error);
        }
      };
  
      const resetForm = () => {
        vakacion.value = {
          transportation: false,
          departureLocation: '',
          transportMode: {
            airplane: true,
            bus: false,
          },
          startDate: '',
          endDate: '',
          arrivalLocation: '',
          description: '<p></p><p></p><p></p><p></p><p></p><p></p>',
          documents: '<p></p><p></p><p></p><p></p><p></p><p></p>',
          hotel: '',
          arrivalCountry: '',
          price: 0,
          stars: 0,
          food: true,
          breakfast: false,
          lunch: false,
          dinner: false,
          images: [],
          seaside: false,
          mountains: false,
          sightseeing: false,
          extreme: false,
          family: false,
          young: false,
          elderly: false,
          maxPerson: 0,
          agencyId: agencyId.value || '',
          weblink: '',
        };
        isNewVakacion.value = true;
      };
  
      const submitVakacion = async () => {
        try {
          if (isNewVakacion.value) {
            const colRef = collection(db, 'vacations');
            await addDoc(colRef, vakacion.value);
            alert('Vakacion added successfully!');
          } else {
            if (vakacionId.value) {
              const vakacionRef = doc(db, 'vacations', vakacionId.value);
              await setDoc(vakacionRef, vakacion.value);
              alert('Vakacion updated successfully!');
            } else {
              console.error('Vakacion ID is undefined!');
            }
          }
        } catch (e) {
          console.error('Error adding/updating document: ', e);
          alert('Failed to add/update vakacion');
        }
      };
  
      return {
        vakacion,
        isNewVakacion,
        submitVakacion,
      };
    },
  });
  </script>
  

  
  
  <style scoped>

.add-vakacion-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1em;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkbox-inline {
  display: inline-block;
  margin-right: 1em;
}

.star-rating {
  margin-top: 1em;
}

.stars {
  display: flex; /* Flexbox layout használata a csillagok sorba rendezéséhez */
  align-items: center; /* A csillagok középre igazítása */
}

.star {
  font-size: 2em;
  color: #ddd;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
  margin-right: 5px;
}

.star-selected {
  color: rgb(233, 198, 0);
}

input[type="radio"] {
  display: none; /* A radio gomb rejtése */
}

form div {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
}

input[type="text"],
input[type="date"],
textarea {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="checkbox"] {
  margin-right: 0.5em;
}

button {
  width: 100%;
  padding: 0.5em;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
.image-preview-container {
  margin-top: 1em;
}

.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
}

.image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-preview img {
  max-width: 100px;
  max-height: 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  object-fit: cover;
  margin-bottom: 0.5em;
}

.image-preview p {
  font-size: 0.8em;
  text-align: center;
  margin: 0;
}
  </style>
  