import { defineStore } from 'pinia'

import { auth } from '../plugins/firebase'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'

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
  async function loginDataBase(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Error al iniciar la app:', error.message)
    }
  }

  return { loginDataBase }
})
