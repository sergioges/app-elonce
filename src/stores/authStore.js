import { reactive } from 'vue'
import { defineStore } from 'pinia'

import { signInAnonymously as firebaseSignInAnonymously } from 'firebase/auth'

import { auth } from '../plugins/firebase'

// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  // CREATE USER
  // async function registerUser(email, password) {
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     console.log('Usuario registrado:', userCredential.user);
  //   } catch (error) {
  //     console.error('Error al registrar usuario:', error.message);
  //   }
  // }

  // LOGIN USER
  // async function loginDataBase(email, password) {
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password)
  //   } catch (error) {
  //     console.error('Error al iniciar la app:', error.message)
  //   }
  // }

  const anonymousUser = reactive({
    credential: null,
    isAuthenticated: false
  })

  async function signInAnonymously() {
    try {
      const userCredential = await firebaseSignInAnonymously(auth)
      anonymousUser.credential = userCredential.user
      anonymousUser.isAuthenticated = true
    } catch (error) {
      console.error('Error in anonymous authentication:', error)
      throw error
    }
  }

  return { anonymousUser, signInAnonymously }
})
