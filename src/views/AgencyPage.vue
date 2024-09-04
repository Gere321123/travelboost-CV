<template>
  <div class="agency-page">
    <h1>Agency Details</h1>

    <form @submit.prevent="updateAgency">
      <div class="inputs">
        <label>Agency Name:</label>
        <input type="text" v-model="agencyName" required />
      </div>
      <div class="inputs">
        <label>Website:</label>
        <input type="text" v-model="website" />
      </div>
      <div class="inputs">
        <label>Phone Number:</label>
        <input type="tel" v-model="phoneNumber" required />
      </div>
      <div class="inputs">
        <label>Address (Google Maps link):</label>
        <input type="text" v-model="address" required />
      </div>
      <BankCardInput
        v-model:cardNumber="bankCardNumber"
        v-model:cardExpiry="bankCardExpiry"
        v-model:cardCVC="bankCardCVC"
      />
      <div class="inputs">
        <label for="profilePicture">Profile Picture:</label>
        <input type="file" @change="onFileChange" />
      </div>
      <button type="submit">Update Agency</button>
    </form>

    <div class="employee-list">
      <h2>Employees</h2>
      <div class="add-employee">
      <input type="email" v-model="newEmployeeEmail" placeholder="Enter employee email" />
      <button @click="addEmployeeByEmail">Add Employee</button>
      </div>
      <div v-for="employee in employees" :key="employee.uid" class="employee">
        <img :src="employee.profilePictureUrl" alt="Profile Picture" />
        <span>{{ employee.name }}</span>
        <button @click="showPopup(employee.uid)">Delete</button>
      </div>
    </div>

    <PopUp
      v-if="popupVisible"
      :onOkay="handlePopupOkay"
      :onCancel="handlePopupCancel"
    >
      <p>{{ popupMessage }}</p>
    </PopUp>


    <NormalPopUp v-if="updateAgencyBool" :TogglePopup="cancelpopup">
      <p>{{ popupMessage }}</p> 
    </NormalPopUp>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from 'vue';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import BankCardInput from '../components/BankCardInput.vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import PopUp from '../components/2PopUp.vue';
import NormalPopUp from '../components/PopUp.vue';
import bcrypt from 'bcryptjs';

interface Employee {
  uid: string;
  name: string;
  profilePictureUrl: string;
  agencyId: string;
}

export default defineComponent({
  name: 'AgencyPage',
  components: {
    BankCardInput,
    PopUp,
    NormalPopUp,
  },
  setup() {
    const updateAgencyBool = ref(false);
    const agencyName = ref('');
    const oGpassword: Ref<string> = ref(''); 
    const website = ref('');
    const phoneNumber = ref('');
    const address = ref('');
    const bankCardNumber = ref('');
    const bankCardExpiry = ref('');
    const bankCardCVC = ref('');
    const profilePictureUrl = ref('');
    let profilePictureFile: File | null = null;
    const userEmail = ref('');
    const employees = ref<Employee[]>([]);
    const currentAgencyId = ref('');
    const newEmployeeEmail = ref('');

    const popupVisible = ref(false);
    const popupMessage = ref('');
    const popupAction = ref<(() => void) | null>(null);


    const fetchAgencyDetails = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user && user.email) {
          userEmail.value = user.email;

          const agenciesCollection = collection(db, 'agencies');
          const q = query(agenciesCollection, where('email', '==', userEmail.value));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const agencyData = querySnapshot.docs[0].data();
            currentAgencyId.value = querySnapshot.docs[0].id;
            agencyName.value = agencyData.name;
            website.value = agencyData.website;
            phoneNumber.value = agencyData.phoneNumber;
            address.value = agencyData.address;
            bankCardNumber.value = agencyData.bankCardDetails.number;
            bankCardExpiry.value = agencyData.bankCardDetails.expiry;
            bankCardCVC.value = agencyData.bankCardDetails.cvc;
            profilePictureUrl.value = agencyData.profilePictureUrl;


            if (agencyData.employees) {
              for (const employeeUid of agencyData.employees) {
                const employee = await fetchUserDetails(employeeUid);
                if (employee) {
                  employees.value.push(employee);
                }
              }
            }
          }
        }
      });
    };

    const fetchUserDetails = async (uid: string): Promise<Employee | null> => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return {
            uid,
            name: userData.name,
            profilePictureUrl: userData.profilePictureUrl,
            agencyId: userData.agencyId || '',
          };
        }
      } catch (error) {
        console.error('Error fetching user details: ', error);
      }
      return null;
    };
    const cancelpopup = () => {
      updateAgencyBool.value = false;
    };
    const updateAgency = async () => {
      try {
        if (profilePictureFile) {
          const storage = getStorage();
          const storageReference = storageRef(storage, `profile_pictures/${profilePictureFile.name}`);
          await uploadBytes(storageReference, profilePictureFile);
          profilePictureUrl.value = await getDownloadURL(storageReference);
        }
       
        updateAgencyBool.value = true;
        popupMessage.value = "You successfully updated your agency!";
        const agencyData = {
          name: agencyName.value,
          website: website.value,
          phoneNumber: phoneNumber.value,
          address: address.value,
          employees: employees.value.map(emp => emp.uid),
          bankCardDetails: {
            number: bankCardNumber.value,
            expiry: bankCardExpiry.value,
            cvc: bankCardCVC.value,
          },
          profilePictureUrl: profilePictureUrl.value,
        };

        const agenciesCollection = collection(db, 'agencies');
        const q = query(agenciesCollection, where('email', '==', userEmail.value));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const agencyDocRef = querySnapshot.docs[0].ref;
          await updateDoc(agencyDocRef, agencyData);
        }
      } catch (error) {
        console.error('Error updating agency: ', error);
      }
    };

    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        profilePictureFile = target.files[0];
      }
    };



    const deleteEmployee = async (uid: string) => {
      try {
        const agencyDocRef = doc(db, 'agencies', currentAgencyId.value);
        await updateDoc(agencyDocRef, {
          employees: arrayRemove(uid),
        });

        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
          joinAgency: false,
          agencyId: "",
        });

        // Update local state
        employees.value = employees.value.filter(emp => emp.uid !== uid);
      } catch (error) {
        console.error('Error deleting employee: ', error);
      }
    };

    const showPopup = ( uid: string) => {
      popupVisible.value = true;

    popupMessage.value = 'Are you sure you want to delete this employee?';
    popupAction.value = () => deleteEmployee(uid);
  
};

const handlePopupOkay = () => {
  if (popupAction.value) {
    popupAction.value();
  }
  popupVisible.value = false;
};

const handlePopupCancel = () => {
  popupVisible.value = false;
};
const addEmployeeByEmail = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', newEmployeeEmail.value));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        agencyId: currentAgencyId.value,
        joinAgency: true,
      });

      const employee = await fetchUserDetails(userId);
      if (employee) {
        employees.value.push(employee);
        const agencyDocRef = doc(db, 'agencies', currentAgencyId.value);
            await updateDoc(agencyDocRef, {
              employees: arrayUnion(userId),
            });
      }

      updateAgencyBool.value = true;
      popupMessage.value = "The user successfully add";
    } else {
      // Show popup if user is not found
      updateAgencyBool.value = true;
      popupMessage.value = "The user not found";
    }
  } catch (error) {
    console.error('Error adding employee by email: ', error);
  }
};


    onMounted(fetchAgencyDetails);

    return {
      agencyName,
      newEmployeeEmail,
      addEmployeeByEmail,
      website,
      phoneNumber,
      address,
      bankCardNumber,
      bankCardExpiry,
      bankCardCVC,
      profilePictureUrl,
      employees,
      onFileChange,
      updateAgency,
      deleteEmployee,
      currentAgencyId,
      showPopup,
      popupVisible,
      popupMessage,
      handlePopupOkay,
      handlePopupCancel,
      oGpassword,
      updateAgencyBool,
      cancelpopup,
    };
  },
});
</script>

<style scoped>
.agency-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.agency-page h1 {
  text-align: center;
  margin-bottom: 20px;
}

.agency-form {
  display: flex;
  flex-direction: column;
}

.agency-form div {
  margin-bottom: 15px;
}

.agency-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.agency-form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}
input {
  width: calc(100% - 10px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.inputs{
  margin: 12px;
}
.agency-form button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.agency-form button:hover {
  background-color: #0056b3;
}
</style>
