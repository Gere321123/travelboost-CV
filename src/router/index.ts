import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import LoginPage from '../views/LoginPage.vue'
import Destinacion from '../views/Destinations.vue'
import LastMinute from '../views/LastMinute.vue'
import AllInclusive from '../views/AllInclusive.vue'
import AddVakacion from '../views/AddVacation.vue'
import ProfilePage from '../views/ProfilePage.vue'

import CreateAgency from '../views/CreateAgency.vue'

import AgencyPage from '../views/AgencyPage.vue'
import VacationPage from '../views/VacationPage.vue'

import AgencyVacation from '../views/AgencyVacation.vue'

import BookPage from '../views/BookPage.vue'

import { getAuth,  onAuthStateChanged } from 'firebase/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/agency',
    name: 'AgencyPage',
    component: AgencyPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/vacation/:id',
    name: 'VacationPage',
    component: VacationPage,
  },
  {
    path: '/create-agency',
    name: 'CreateAgency',
    component: CreateAgency,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/book',
    name: 'BookPage',
    component: BookPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/add-vacation/:agencyId/:id?',
    name: 'AddVakacion',
    component: AddVakacion,
    meta: { requiresAuth: true }
  },
  {
    path: '/agency-vacation',
    name: 'AgencyVacation',
    component: AgencyVacation,
    meta: { requiresAuth: true }
  },
  {
    path: '/destinations',
    name: 'DestinationsPage',
    component: Destinacion
  },
  {
    path: '/last-minute',
    name: 'LastMinute',
    component: LastMinute
  },
  {
    path: '/all-inclusive',
    name: 'AllInclusive',
    component: AllInclusive
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

let isAuthInitialized = false;
let isAuthenticated = false;

const auth = getAuth();
onAuthStateChanged(auth, user => {
  isAuthenticated = !!user;
  isAuthInitialized = true;
});

router.beforeEach((to, from, next) => {
  if (!isAuthInitialized) {
    const unregisterAuthObserver = onAuthStateChanged(auth, user => {
      isAuthenticated = !!user;
      isAuthInitialized = true;
      unregisterAuthObserver(); // Hívás megszüntetése
      proceed();
    });
  } else {
    proceed();
  }

  function proceed() {
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  }
});

export default router
