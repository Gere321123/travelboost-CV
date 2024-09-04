import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { auth, provider } from './firebase';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

createApp(App).use(router).mount('#app');

// Add event listener for Google login button
const googleLogin = document.getElementById("google-login-btn");
if (googleLogin) {
  googleLogin.addEventListener("click", function() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
        }
        const user = result.user;
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  });
}
