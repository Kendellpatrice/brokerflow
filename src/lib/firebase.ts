import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBUV9FM58P8m40tS6j8Hv2rAejk8g0vZsc",
  authDomain: "brokerflow-d370b.firebaseapp.com",
  projectId: "brokerflow-d370b",
  storageBucket: "brokerflow-d370b.firebasestorage.app",
  messagingSenderId: "35889667976",
  appId: "1:35889667976:web:fb2301ffa64495037ca43d",
  measurementId: "G-GQS8PH6EPY",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default app;
